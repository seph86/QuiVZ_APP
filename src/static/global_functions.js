export function noInternetNag(hide) {
  if (hide && window.$("#nointernet").css("display") === "none") return; //Ignore because nag is already hidden
  window.$("#nointernet").nag( hide ? "hide" : "show" );
}