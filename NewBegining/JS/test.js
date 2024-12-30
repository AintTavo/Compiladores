function runAnalysis() {
  const inputText = document.getElementById("grammar-input").value;
  const resultDiv = document.getElementById("result");

  try {
    const lexer = new GramaticLexer(inputText);
    const isValid = StartDescent(lexer);
    console.log(isValid);
    resultDiv.textContent = isValid
      ? "✅ ¡La gramática es válida!"
      : "❌ La gramática es inválida.";
    resultDiv.className = isValid ? "" : "error";
    resultDiv.style.display = "block";
  } catch (error) {
    resultDiv.textContent = "⚠️ Error: " + error.message;
    resultDiv.className = "error";
    resultDiv.style.display = "block";
  }
}