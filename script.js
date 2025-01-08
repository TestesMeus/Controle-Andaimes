const numerosDeSerieExistentes = new Set(); // Conjunto para armazenar números de série existentes

document.getElementById("btnCadastrar").addEventListener("click", () => {
  document.getElementById("dialogForm").showModal();
});

document.getElementById("btnCancelar").addEventListener("click", () => {
  document.getElementById("dialogForm").close();
});

document.getElementById("btnSalvar").addEventListener("click", (e) => {
  e.preventDefault();
  const equipamento = document.getElementById("equipamento").value;
  const quantidade = parseInt(document.getElementById("quantidade").value);
  const obra = document.getElementById("obra").value;
  const responsavel = document.getElementById("responsavel").value;
  const dataRetirada = document.getElementById("dataRetirada").value;
  const dataDevolucao = document.getElementById("dataDevolucao").value;

  if (!equipamento || !quantidade || !obra || !responsavel || !dataRetirada || !dataDevolucao) {
    alert("Por favor, preencha todos os campos.");
    return;
  }

  const tbody = document.querySelector("table tbody");
  const newRow = document.createElement("tr");
  newRow.innerHTML = `
      <td>${dataRetirada}</td> <!-- Data de retirada -->
      <td>${equipamento}</td>
      <td>${quantidade}</td>
      <td>${obra}</td>
      <td>${responsavel}</td>
      <td>${dataDevolucao}</td>
      <td></td> <!-- Coluna para números de série -->
  `;
  tbody.appendChild(newRow);

  document.getElementById("dialogForm").close();

  abrirDialogoSeries(quantidade, newRow); // Chama a função para abrir o diálogo de números de série

  // Ordenar a tabela após a adição
  ordenarTabela();
});

// Função para abrir o diálogo de números de série
function abrirDialogoSeries(quantidade, row) {
  const seriesContainer = document.getElementById("seriesContainer");
  seriesContainer.innerHTML = ''; // Limpa o container

  for (let i = 0; i < quantidade; i++) {
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = `Número de Série ${i + 1}`;
    input.required = true;
    seriesContainer.appendChild(input);
  }

  document.getElementById("dialogSeries").showModal(); // Abre o diálogo para números de série

  document.getElementById("btnSalvarSeries").onclick = () => {
    const seriesInputs = seriesContainer.querySelectorAll("input");
    const seriesList = [];

    seriesInputs.forEach(input => {
      seriesList.push(input.value);
    });

    // Adiciona os números de série como botões na tabela
    row.cells[6].innerHTML = ''; // Limpa a coluna de números de série
    const seriesCount = {}; // Objeto para contar ocorrências de cada número de série

    seriesList.forEach(serie => {
      seriesCount[serie] = (seriesCount[serie] || 0) + 1; // Conta as ocorrências
    });

    Object.keys(seriesCount).forEach(serie => {
      const button = document.createElement("button");
      button.textContent = serie;
      button.className = "btn-serie"; // Classe para estilizar

      // Verifica se o número de série já existe
      if (numerosDeSerieExistentes.has(serie) || seriesCount[serie] > 1) {
        button.classList.add("duplicado"); // Adiciona a classe para duplicados
        button.style.backgroundColor = "red"; // Muda a cor para vermelho se duplicado
      } else {
        numerosDeSerieExistentes.add(serie); // Adiciona ao conjunto se não existir
      }

      button.onclick = () => {
        removerSerie(button, row, serie);
      };

      // Adiciona o botão à célula
      row.cells[6].appendChild(button); // Adiciona o botão na coluna de números de série
    });

    // Atualiza a coloração dos botões
    atualizarColoracao(row);

    document.getElementById("dialogSeries").close();
  };

  document.getElementById("btnCancelarSeries").onclick = () => {
    document.getElementById("dialogSeries").close();
  };
}

// Função para remover um número de série
function removerSerie(button, row, serie) {
  button.remove(); // Remove o botão do número de série

  // Verifica se ainda há botões na coluna
  if (row.cells[6].children.length === 0) {
    row.remove(); // Remove a linha se não houver mais números de série
    numerosDeSerieExistentes.delete(serie); // Remove do conjunto se a linha for excluída
  }

  // Atualiza a coloração dos botões restantes
  atualizarColoracao(row);
}

// Função para atualizar a coloração dos botões de série
function atualizarColoracao(row) {
  const seriesButtons = Array.from(row.cells[6].children);
  const seriesCount = {};

  seriesButtons.forEach(button => {
    const serie = button.textContent;
    seriesCount[serie] = (seriesCount[serie] || 0) + 1; // Conta as ocorrências
  });

  seriesButtons.forEach(button => {
    const serie = button.textContent;
    if (seriesCount[serie] > 1) {
      button.style.backgroundColor = "red"; // Muda a cor para vermelho se duplicado
    } else {
      button.style.backgroundColor = ""; // Reseta a cor se não for duplicado
    }
  });
}

// Função para ordenar a tabela com base na data de retirada
function ordenarTabela() {
  const tbody = document.querySelector("table tbody");
  const rows = Array.from(tbody.rows);

  // Ordena as linhas com base na data de retirada
  rows.sort((a, b) => {
    const dateA = new Date(a.cells[0].textContent); // Data de retirada da linha A
    const dateB = new Date(b.cells[0].textContent); // Data de retirada da linha B
    return dateA - dateB; // Ordena de forma crescente
  });

  // Limpa o tbody e adiciona as linhas ordenadas
  tbody.innerHTML = '';
  rows.forEach(row => tbody.appendChild(row));
}
