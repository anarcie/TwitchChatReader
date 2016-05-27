function save_options() {
  var vEnabled = document.getElementById('Enable').value;
  var vPitch   = document.getElementById('Pitch').value;
  var vVolume   = document.getElementById('Volume').value;
  var vRate   = document.getElementById('Rate').value;
  var vMaxLength   = document.getElementById('MaxLength').value;  
  chrome.storage.sync.set({
    Enabled: vEnabled,
    Pitch: vPitch,
    Volume: vVolume,
    Rate: vRate,
    MaxLength: vMaxLength
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  chrome.storage.sync.get({         
        Enabled: 'true', 
        Pitch: '0', 
        Volume: '1',
        Rate: '1.0',
        MaxLength: '60'
      }, function(items) {
    document.getElementById('Enable').value = items.Enabled;
    document.getElementById('Pitch').value = items.Pitch;
    document.getElementById('Volume').value = items.Volume;
    document.getElementById('Rate').value = items.Rate;
    document.getElementById('MaxLength').value = items.MaxLength;
    MaxLength
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);