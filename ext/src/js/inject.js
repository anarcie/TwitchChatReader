var Debugging = false; 
var QueuedSpeech = 0; 
var SpeakingChat = true;
var SpeakingVol  = 1; 
var SpeakingPit  = 0; 
var SpeakingRate = 1.0;
var LinkParser = false; 
var synth = window.speechSynthesis;

var fixStuckQueueCounter = 0; 
var MessageSpeechQueued = false; 
var MessageSpeechLength = 60; 
var ScanMessageInterval = 1000;

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

    chrome.storage.sync.get({ 
        Enabled: 'true', 
        Pitch: '0', 
        Volume: '1',
        Rate: '1.0',
        MaxLength: '60'

    }, function(items) {
        SpeakingChat = items.Enabled;
        SpeakingVol  = items.Volume;
        SpeakingPit  = items.Pitch;
        SpeakingRate = items.Rate; 
        MessageSpeechLength = items.MaxLength

    });

    var Messages     = $('.message').not('.scanned');
    var Voice2Speech = $('.message').not('.spoken').slice(-5);

    //If we have nothing to say, lets look back a bit further
    if (Voice2Speech.length == 0){
        Voice2Speech = $('.message').not('.spoken').slice(-15);
    }

    if(SpeakingChat == 'true'){
        //Pick Random Messages To Speak Out Loud
        Voice2Speech.each(function(i, obj) { 
            var Spamerino = $(obj).text()
            Spamerino = Spamerino.trim();
            if (FindLinks(Spamerino) == false){
                if (Speak(SpamWithEmotes($(obj)))){
                    $(obj).css('color', 'chartreuse');
                    $(obj).addClass( "spoken" );
                }
            }
        });   
    }
    //Scan All Messages to Parse Links
    Messages.each(function(i, obj) {

        //Get The Spam Text
        var Spamerino = $(obj).text()
        Spamerino = Spamerino.trim();

        //See if there is a link
        var ParsedSpamerino = FindLinks(Spamerino);

        //Load Link Into Chat
        if (ParsedSpamerino != false){
            if(LinkParser) { $(obj).after(Parse(Spamerino)); }
        }
        //Set it as scanned so we skip it next time
        $(obj).addClass( "scanned" );
    });
}

function SpamWithEmotes(Text){
    var ParseMe = Text[0].innerHTML;
    ParseMe = ParseMe.replace(/((<.*?alt=\"))/g, '')
    ParseMe = ParseMe.replace(/(" title.*?\>)/g, '')
    ParseMe = ParseMe.replace(/[\n\r]/g, '');
    ParseMe = ParseMe.replace(/  /g, '');
    ParseMe = ParseMe.replace(/\s\s+/g, '');
    ParseMe = ParseMe.replace(/<[^>]*>/g, '');
    ParseMe = ParseMe.replace(/[^A-Za-z0-9 #@\.]/g, '');
    return ParseMe.trim(); 
}

//-----------------------------
// Annoying Talking Chat
//-----------------------------
//-----------------------------
// Annoying Talking Chat
//-----------------------------
function Speak(Phrase){
            if (!synth.speaking & !MessageSpeechQueued){
            var msg = new SpeechSynthesisUtterance();
            var voices = synth.getVoices();
            var GoodVoices = [2,3,4]; 
            var RandVoice = GoodVoices[Math.floor(Math.random() * GoodVoices.length)];
            MessageSpeechQueued = true;
            msg.voice = voices[RandVoice]; // Note: some voices don't support altering params
            msg.voiceURI = 'native';
            msg.volume = SpeakingVol; // 0 to 1
            msg.rate =  SpeakingRate // 0.1 to 10
            msg.pitch = SpeakingPit; //0 to 2
            msg.text = Phrase.substring(0, MessageSpeechLength);
            msg.lang = 'en-US';
            msg.onend = function (event) {
                MessageSpeechQueued = false;
            };
            synth.speak(msg); 
            return true; 
        } 
        //Currently Not Speaking, But Queue Still Engaged
        if (!synth.speaking & MessageSpeechQueued) {
            fixStuckQueueCounter++;
        }
        
        //If this happens n times, force the queue to be empty
        if (fixStuckQueueCounter > 2) {
            synth.cancel()
            fixStuckQueueCounter = 0; 
            MessageSpeechQueued = false;
        }
        return false; 
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










