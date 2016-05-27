var Debugging = false; 
var QueuedSpeech = 0; 
var SpeakingChat = true;
var synth = window.speechSynthesis;
var SkippedMessages = 0; 

var ScanMessageInterval = 1000;
var MessagesPerScan     = 1;
(function() {
    speechSynthesis.cancel();
    $('.message').not('.scanned').each(function(i, obj) {
        $(obj).addClass( "scanned" ).css('font-weight', 'bold');
    });
    setInterval(ScanMessages,ScanMessageInterval);
})();


//-----------------------------
// Scan Messages
//-----------------------------
// Handles Scanning / Tagging Messages
//-----------------------------
//
function ScanMessages(){
    var Messages     = $('.message').not('.scanned');
    var RandMessages = $('.message').not('.scanned');

    //Generate a Message Set Of Random Messgaes To 
    //Send to text to speech
    RandomMessages = RandMessages.sort(function(){ 
        return Math.round(Math.random())-0.5
    }).slice(0,MessagesPerScan);

    //Pick Random Messages To Speak Out Loud
    RandomMessages.each(function(i, obj) { 
        var Spamerino = $(obj).text()
        Spamerino = Spamerino.trim();
        if (FindLinks(Spamerino) == false){
            Speak(SpamWithEmotes($(obj)));
            $(obj).css('color', 'chartreuse');

        }
    });

    //Scan All Messages to Parse Links
    Messages.each(function(i, obj) {

        console.log($(obj).text())


        //Get The Spam Text
        var Spamerino = $(obj).text()
        Spamerino = Spamerino.trim();

        //See if there is a link
        var ParsedSpamerino = FindLinks(Spamerino);

        //Load Link Into Chat
        if (ParsedSpamerino != false){
            $(obj).after(Parse(Spamerino));
        }
        //Set it as scanned so we skip it next time
        $(obj).addClass( "scanned" ).css('font-weight', 'bold');
        //$( "*" ).prependTo( obj );
    });
}

function SpamWithEmotes(Text){
    var ParseMe = Text[0].innerHTML;
    ParseMe = ParseMe.replace(/((<.*alt=\"))/g, '')
    ParseMe = ParseMe.replace(/(" title.*\>)/g, '')
    ParseMe = ParseMe.replace(/[\n\r]/g, '');
    ParseMe = ParseMe.replace(/  /g, '');
    ParseMe = ParseMe.replace(/\s\s+/g, '');
    ParseMe = ParseMe.replace("<", '');
    ParseMe = ParseMe.replace(">", '');
    ParseMe = ParseMe.replace("/<[^>]*>/g", '');
    return ParseMe.trim(); 
}

//-----------------------------
// Annoying Talking Chat
//-----------------------------
function Speak(Phrase){
    if ('speechSynthesis' in window) {
        console.log(synth.speaking
        var msg = new SpeechSynthesisUtterance();
        var voices = synth.getVoices();
        var GoodVoices = [2,3,4]; 
        var RandVoice = GoodVoices[Math.floor(Math.random() * GoodVoices.length)];
        msg.voice = voices[RandVoice]; // Note: some voices don't support altering params
        msg.voiceURI = 'native';
        msg.volume = 1; // 0 to 1
        msg.rate = 1.2 // 0.1 to 10
        msg.pitch = 0; //0 to 2
        msg.text = Phrase.substring(0, 99);
        msg.lang = 'en-US';
        synth.speak(msg); 
    } 
}

//-----------------------------
// Find Links
//-----------------------------
// Handles Finding A Link in a Chat Message
//-----------------------------
//
function FindLinks(Chat_Spam){
    //Skip
    if (Chat_Spam.length == 0) {return false;}
    //Process
    var url_re = /https?[^<"]+/g  /* pattern for url-like substrings */
	while(m = url_re.exec(Chat_Spam)){ /* match all url-like substrings in input */
        if (Debugging) {console.log( Chat_Spam + "Is a Link " );}
        return true;
    }
    //Failed to find linkerino
    return false; 
}

//-----------------------------
// Parse
//-----------------------------
// Handles Sending the link to the correct processor
//-----------------------------
//
function Parse(Link){
    var LowerLink = Link.toLowerCase();
    
    //Imgur Parser
    if  (LowerLink.indexOf("imgur") > -1) return Imgur(Link); 
    
    //Not Supported Link
    if (Debugging) {console.log("Not Supported");} 
    return "(Link Not Supported)"; 
}

//-----------------------------
// Imgur
//-----------------------------
function Imgur(Link){
    id_re = /(?:https?:\/\/)?(?:i\.)?imgur\.com\/(?:gallery\/)?(.+(?=[sbtmlh]\..{3,4})|.+(?=‌​\..{3,4})|.+?(?:(?=\s)|$))/
    var ID = Link.match(id_re)[1];
    var Linky = "<br/><img src='https://i.imgur.com/"+ID+".png'></img>";
    return Linky
}

//-----------------------------
// Imgur
//-----------------------------
function Twitter(Link){
    
}










