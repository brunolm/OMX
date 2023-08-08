/// <reference path="../bin/jquery-1.7.1.min.js" />
window.Pages = {};

window.Pages.Home = window.location.href.match(/https?:\/\/[^\/]+/)[0];
var id = "";
try{
id = unsafeWindow.document.getElementsByTagName("script")[0].innerHTML.match(/uid[^\n]+'(\d+)'[^\n]+/)[1];
}
catch(ex){}
window.Pages.ProfileID = id;

window.Pages.NotificationsOf = "/Main#Notifications?uid={0}";
window.Pages.ProfileOf = "/Main#Profile?uid={0}";
window.Pages.ScrapsOf = "/Main#Scrapbook?uid={0}";
window.Pages.PhotosOf = "/Main#AlbumList?uid={0}";
window.Pages.VideosOf = "/Main#FavoriteVideos?uid={0}";
window.Pages.TestimonialsOf = "/Main#Testimonials?uid={0}";

window.Pages.Profile = "/Main#Profile";
window.Pages.Scraps = "/Main#Scrapbook";
window.Pages.Communities = "/Main#Communities";
window.Pages.Notifications = "/Main#Notifications";
window.Pages.Conversations = "/Main#Conversations";
window.Pages.Reminders = "/Main#Reminders";
window.Pages.Birthdays = "/Main#Birthdays";
window.Pages.Photos = "/Main#AlbumList";
window.Pages.Videos = "/Main#FavoriteVideos";
window.Pages.Testimonials = "/Main#Testimonials";
window.Pages.Applications = "/Main#AppDirectory?dirFilters=featured&dirQuery=";
window.Pages.Promote = "/Main#Promote";


window.QueryString = window.GetQueryString(window.location.hash.substring(window.location.hash.indexOf("?") + 1));

window.addEventListener("hashchange", function() {
    window.QueryString = window.GetQueryString(window.location.hash.substring(window.location.hash.indexOf("?") + 1));    
}, false);