// Word Counter - pure browser logic. Reading time uses 200 words per minute.
function countWords(text){
  var words = text.trim() ? text.trim().split(/\s+/).filter(Boolean) : [];
  var sentences = text.trim() ? text.split(/[.!?]+/).map(function(s){return s.trim();}).filter(Boolean) : [];
  var paragraphs = text.trim() ? text.split(/\n\s*\n/).map(function(s){return s.trim();}).filter(Boolean) : [];
  return {words: words.length, chars: text.length, charsNoSpaces: text.replace(/\s/g,'').length, sentences: sentences.length, paragraphs: paragraphs.length, minutes: Math.ceil(words.length/200) || 0};
}
function render(){
  var c = countWords(document.getElementById('wcInput').value);
  document.getElementById('wcResult').textContent = 'Words: '+c.words+'\nCharacters: '+c.chars+'\nCharacters (no spaces): '+c.charsNoSpaces+'\nSentences: '+c.sentences+'\nParagraphs: '+c.paragraphs+'\nReading time: '+c.minutes+' minute(s)';
}
document.getElementById('wcInput').addEventListener('input', render);
document.getElementById('wcClear').addEventListener('click', function(){ document.getElementById('wcInput').value=''; render(); });
document.getElementById('wcCopy').addEventListener('click', function(){ navigator.clipboard.writeText(document.getElementById('wcResult').textContent); });
render();
