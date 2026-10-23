function unsplash(id: string, params = "w=480&q=80"): string {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&${params}`;
}

export const DEMO_SITE_PHOTOS = {
  main: unsplash("photo-1674216645383-afc4e42c227f"),
  yaounde: unsplash("photo-1782558399208-1f511bb57177"),
  bafoussam: unsplash("photo-1783343982687-4c169ab0cf23"),
};

export const DEMO_DISH_PHOTOS = {
  pouletDG: unsplash("photo-1773620494293-e9e075dd48fd", "w=240&q=80"),
  ndole: unsplash("photo-1604329760661-e71dc83f8f26", "w=240&q=80"),
  brochettes: unsplash("photo-1594999945795-e570338fdd12", "w=240&q=80"),
  eru: unsplash("photo-1763048443535-1243379234e2", "w=240&q=80"),
  poisson: unsplash("photo-1665401015549-712c0dc5ef85", "w=240&q=80"),
  jusGingembre: unsplash("photo-1682530016814-6a1c1311cd6e", "w=240&q=80"),
};
