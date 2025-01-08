function runAnalysis() {
  const inputText = document.getElementById("grammar-input").value;
  const resultDiv = document.getElementById("result");

  try {
    const lexer = new GramaticLexer(inputText);
    const isValid = parseAndMarkTerminals(lexer);

    if(isValid){
      resultDiv.textContent = "✅ ¡La gramática es válida!";
    }
    else{
      resultDiv.textContent = "❌ La gramática es inválida.";
    }
    resultDiv.className = isValid ? "" : "error";
    resultDiv.style.display = "block";
  } catch (error) {
    resultDiv.textContent = "⚠️ Error: " + error.message;
    resultDiv.className = "error";
    resultDiv.style.display = "block";
  }
}