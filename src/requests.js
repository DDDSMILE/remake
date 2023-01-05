import { getOneMonthAgoReleaseDate } from "./utils";

export const GITHUB_BASE_URL = "https://github.com/Th3Wall";
export const GITHUB_AVATAR_URL =
  "";
const GITHUB_ASSETS_BASE_URL =
  "https://cdn.jsdelivr.net/gh/Th3Wall/assets-cdn/Fakeflix";
export const LANG = "en-US";
export const REGION = "US";
export const BASE_IMG_URL = "https://image.tmdb.org/t/p/original";
export const FALLBACK_IMG_URL = `${GITHUB_ASSETS_BASE_URL}/Fakeflix_readme.png`;
export const LOGO_URL = `./logo.png`;
export const MOBILE_LOGO_URL = `./logo.png`;
export const PROFILE_PIC_URL = `${GITHUB_ASSETS_BASE_URL}/Fakeflix_profilepic.png`;
export const SIGNIN_BGIMG_URL = `${GITHUB_ASSETS_BASE_URL}/Fakeflix_auth_bg.jpg`;
export const TADUM_SOUND_URL = ``;
const ONEMONTHAGO = getOneMonthAgoReleaseDate();
const requests = {
  fetchSearchQuery: `/search/multi?api_key=${"8142ea75f701a2eb0735b5713986b770"}&language=${LANG}&query=`,
  fetchTrendingAll: `/trending/all/week?api_key=${"8142ea75f701a2eb0735b5713986b770"}&sort_by=popularity.desc&language=${LANG}`,
  fetchReleasedMoviesByOneMonth: `/discover/movie?api_key=${"8142ea75f701a2eb0735b5713986b770"}&primary_release_date.gte=${ONEMONTHAGO}&sort_by=popularity.desc&language=${LANG}`,
  // Movies
  fetchTrendingMovies: `/trending/movie/week?api_key=${"8142ea75f701a2eb0735b5713986b770"}&sort_by=popularity.desc&language=${LANG}`,
  fetchUpcomingMovies: `/movie/upcoming?api_key=${"8142ea75f701a2eb0735b5713986b770"}&language=${LANG}`,
  fetchTopRated: `/movie/top_rated?api_key=${"8142ea75f701a2eb0735b5713986b770"}&sort_by=popularity.desc&region=${REGION}`,
  fetchActionMovies: `/discover/movie?api_key=${"8142ea75f701a2eb0735b5713986b770"}&with_genres=28&sort_by=popularity.desc&language=${LANG}`,
  fetchAdventureMovies: `/discover/movie?api_key=${"8142ea75f701a2eb0735b5713986b770"}&with_genres=12&sort_by=popularity.desc&language=${LANG}`,
  fetchComedyMovies: `/discover/movie?api_key=${"8142ea75f701a2eb0735b5713986b770"}&with_genres=35&sort_by=popularity.desc&language=${LANG}`,
  fetchHorrorMovies: `/discover/movie?api_key=${"8142ea75f701a2eb0735b5713986b770"}&with_genres=27&sort_by=popularity.desc&language=${LANG}`,
  fetchRomanceMovies: `/discover/movie?api_key=${"8142ea75f701a2eb0735b5713986b770"}&with_genres=10749&sort_by=popularity.desc&language=${LANG}`,
  fetchWarMovies: `/discover/movie?api_key=${"8142ea75f701a2eb0735b5713986b770"}&with_genres=10752&sort_by=popularity.desc&language=${LANG}`,
  fetchAnimationMovies: `/discover/movie?api_key=${"8142ea75f701a2eb0735b5713986b770"}&with_genres=16&sort_by=popularity.desc&language=${LANG}`,
  discoverMovies: `/discover/movie?api_key=${"8142ea75f701a2eb0735b5713986b770"}&sort_by=popularity.desc&language=${LANG}`,
  // Series
  discoverSeries: `/discover/tv?api_key=${"8142ea75f701a2eb0735b5713986b770"}&sort_by=popularity.desc&language=${LANG}`,
  fetchTrendingSeries: `/trending/tv/week?api_key=${"8142ea75f701a2eb0735b5713986b770"}&sort_by=popularity.desc&language=${LANG}`,
  fetchNetflixOriginals: `/discover/tv?api_key=${"8142ea75f701a2eb0735b5713986b770"}&with_networks=213&sort_by=popularity.desc&language=${LANG}`,
  fetchActionAdventureSeries: `/discover/tv?api_key=${"8142ea75f701a2eb0735b5713986b770"}&with_genres=10759&sort_by=popularity.desc&language=${LANG}`,
  fetchAnimationSeries: `/discover/tv?api_key=${"8142ea75f701a2eb0735b5713986b770"}&with_genres=16&sort_by=popularity.desc&language=${LANG}`,
  fetchComedySeries: `/discover/tv?api_key=${"8142ea75f701a2eb0735b5713986b770"}&with_genres=35&sort_by=popularity.desc&language=${LANG}`,
  fetchCrimeSeries: `/discover/tv?api_key=${"8142ea75f701a2eb0735b5713986b770"}&with_genres=80&sort_by=popularity.desc&language=${LANG}`,
  fetchDocumentarySeries: `/discover/tv?api_key=${"8142ea75f701a2eb0735b5713986b770"}&with_genres=99&sort_by=popularity.desc&language=${LANG}`,
  fetchFamilySeries: `/discover/tv?api_key=${"8142ea75f701a2eb0735b5713986b770"}&with_genres=10751&sort_by=popularity.desc&language=${LANG}`,
  fetchKidsSeries: `/discover/tv?api_key=${"8142ea75f701a2eb0735b5713986b770"}&with_genres=10762&sort_by=popularity.desc&language=${LANG}`,
  fetchSciFiFantasySeries: `/discover/tv?api_key=${"8142ea75f701a2eb0735b5713986b770"}&with_genres=10765&sort_by=popularity.desc&language=${LANG}`,
};

export default requests;
// s
