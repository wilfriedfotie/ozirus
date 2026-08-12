import {
  Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell,
  WidthType, BorderStyle, AlignmentType, ShadingType,
} from 'docx';
import { COMMON_GROUPS, CLOSING_GROUP, PAID_CLOSING_GROUP, FieldDef, FieldGroup, getProjectType, ProjectTypeId, getClientStatus, ClientStatusId } from './briefData';

const PRIMARY = '7967FF';
const INK = '0F172A';
const MUTED = '64748B';
const BORDER = 'E2E8F0';

type Answers = Record<string, string | string[]>;

function formatAnswer(field: FieldDef, value: string | string[] | undefined): string {
  if (value === undefined || value === null) return '—';
  if (Array.isArray(value)) return value.length ? value.join(', ') : '—';
  const trimmed = String(value).trim();
  return trimmed.length ? trimmed : '—';
}

function noBorders() {
  const none = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
  return { top: none, bottom: none, left: none, right: none };
}

function fieldRow(field: FieldDef, answers: Answers): TableRow {
  return new TableRow({
    children: [
      new TableCell({
        width: { size: 32, type: WidthType.PERCENTAGE },
        borders: noBorders(),
        shading: { type: ShadingType.CLEAR, color: 'auto', fill: 'F8FAFC' },
        margins: { top: 100, bottom: 100, left: 120, right: 120 },
        children: [new Paragraph({ children: [new TextRun({ text: field.label, bold: true, size: 19, color: MUTED })] })],
      }),
      new TableCell({
        width: { size: 68, type: WidthType.PERCENTAGE },
        borders: noBorders(),
        margins: { top: 100, bottom: 100, left: 120, right: 120 },
        children: [new Paragraph({ children: [new TextRun({ text: formatAnswer(field, answers[field.id]), size: 20, color: INK })] })],
      }),
    ],
  });
}

function groupSection(group: FieldGroup, answers: Answers): (Paragraph | Table)[] {
  const visibleFields = group.fields;
  return [
    new Paragraph({
      spacing: { before: 320, after: 140 },
      children: [new TextRun({ text: group.title.toUpperCase(), bold: true, size: 20, color: PRIMARY, characterSpacing: 10 })],
      border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: BORDER, space: 6 } },
    }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: visibleFields.map(f => fieldRow(f, answers)),
    }),
  ];
}

export interface BriefExportInput {
  projectTypeId: ProjectTypeId;
  clientStatusId: ClientStatusId;
  answers: Answers;
  docNumber: string;
  date: string;
}

export async function generateBriefDocx({ projectTypeId, clientStatusId, answers, docNumber, date }: BriefExportInput): Promise<Blob> {
  const projectType = getProjectType(projectTypeId);
  const clientStatus = getClientStatus(clientStatusId);

  const children: (Paragraph | Table)[] = [];

  // Header block
  children.push(
    new Paragraph({
      spacing: { after: 40 },
      children: [new TextRun({ text: 'OZIRUS AGENCY', bold: true, size: 18, color: PRIMARY, characterSpacing: 20 })],
    }),
    new Paragraph({
      spacing: { after: 200 },
      children: [new TextRun({ text: 'Fiche de collecte — Brief Client', size: 40, bold: true, color: INK })],
    }),
    new Paragraph({
      spacing: { after: 60 },
      children: [
        new TextRun({ text: `Référence : `, size: 20, color: MUTED }),
        new TextRun({ text: docNumber, size: 20, bold: true, color: INK }),
        new TextRun({ text: `    Date : `, size: 20, color: MUTED }),
        new TextRun({ text: date, size: 20, bold: true, color: INK }),
      ],
    }),
    new Paragraph({
      spacing: { after: 260 },
      children: [
        new TextRun({ text: `Type de projet : `, size: 20, color: MUTED }),
        new TextRun({ text: projectType.label, size: 20, bold: true, color: PRIMARY }),
        new TextRun({ text: `    Statut client : `, size: 20, color: MUTED }),
        new TextRun({ text: clientStatus.label, size: 20, bold: true, color: clientStatus.color.replace('#', '') }),
      ],
      border: { bottom: { style: BorderStyle.SINGLE, size: 10, color: PRIMARY, space: 10 } },
    }),
  );

  // Client payé : la fiche bascule de la découverte commerciale vers le cadrage technique.
  const isPaid = clientStatusId === 'paid';
  const [clientGroup] = COMMON_GROUPS;
  const allGroups: FieldGroup[] = isPaid
    ? [clientGroup, ...projectType.paidGroups, PAID_CLOSING_GROUP]
    : [...COMMON_GROUPS, ...projectType.groups, CLOSING_GROUP];
  for (const group of allGroups) {
    children.push(...groupSection(group, answers));
  }

  children.push(
    new Paragraph({
      spacing: { before: 480 },
      children: [new TextRun({ text: 'Document généré par Ozirus Admin — usage interne', size: 16, italics: true, color: MUTED })],
    }),
  );

  const doc = new Document({
    sections: [
      {
        properties: {},
        children,
      },
    ],
  });

  return Packer.toBlob(doc);
}

export function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
