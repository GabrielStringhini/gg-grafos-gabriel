const RAIO = 30;
const DIRECIONADO = false;

const canvasVertices = document.getElementById("camada1");
const canvasArestas = document.getElementById("camada2");
const ctxVertices = canvasVertices.getContext("2d");
const ctxArestas = canvasArestas.getContext("2d");

function desenhaVertice(vertice) {
  ctxVertices.beginPath();
  ctxVertices.lineWidth = 2;
  ctxVertices.arc(vertice.x, vertice.y, vertice.raio, 0, Math.PI * 2, false);
  ctxVertices.stroke();
  ctxVertices.font = "30px Arial";
  ctxVertices.fillText(vertice.nome, vertice.x - 10, vertice.y + 10);
}

function desenhaAresta(aresta) {
  // Posicao onde aresta vai partir.
  var anguloOrigem = Math.atan(Math.abs(aresta.vertice2.y - aresta.vertice1.y) / Math.abs(aresta.vertice2.x - aresta.vertice1.x));
  var xOrigem = Math.cos(anguloOrigem) * aresta.vertice1.raio;
  var yOrigem = Math.sin(anguloOrigem) * aresta.vertice1.raio;
  
  // Posicao onde a aresta vai chegar.
  var anguloDestino = Math.atan(Math.abs(aresta.vertice2.x - aresta.vertice1.x) / Math.abs(aresta.vertice2.y - aresta.vertice1.y));
  var xDestino = Math.sin(anguloDestino) * aresta.vertice2.raio;
  var yDestino = Math.cos(anguloDestino) * aresta.vertice2.raio;

  // Posicao da flecha na metade da aresta.
  var comprimentoAresta = Math.sqrt((aresta.vertice2.y - aresta.vertice1.y) ** 2 + (aresta.vertice2.x - aresta.vertice1.x) ** 2);
  var meiaAresta = comprimentoAresta / 2;
  var xFlecha = 0;
  var yFlecha = 0;
  var anguloFlecha = 0;

  // Posicao do valor da aresta.
  var xValor = 0;
  var yValor = 0;
  
  ctxArestas.beginPath();

  // Verificacoes das mudancas de quadrante.
  if (aresta.vertice1.x > aresta.vertice2.x) {
    if (aresta.vertice1.y > aresta.vertice2.y) {
      ctxArestas.moveTo(aresta.vertice1.x - xOrigem, aresta.vertice1.y - yOrigem);
      ctxArestas.lineTo(aresta.vertice2.x + xDestino, aresta.vertice2.y + yDestino);
      xFlecha = aresta.vertice1.x - Math.cos(anguloOrigem) * meiaAresta;
      yFlecha = aresta.vertice1.y - Math.sin(anguloOrigem) * meiaAresta;
      anguloFlecha = -90 * Math.PI / 180 + anguloOrigem;
    } else {
      ctxArestas.moveTo(aresta.vertice1.x - xOrigem, aresta.vertice1.y + yOrigem);
      ctxArestas.lineTo(aresta.vertice2.x + xDestino, aresta.vertice2.y - yDestino);
      xFlecha = aresta.vertice1.x - Math.cos(anguloOrigem) * meiaAresta;00
      yFlecha = aresta.vertice1.y + Math.sin(anguloOrigem) * meiaAresta;
      anguloFlecha = -90 * Math.PI / 180 - anguloOrigem;
    }
  } else {
    if (aresta.vertice1.y > aresta.vertice2.y) {
      ctxArestas.moveTo(aresta.vertice1.x + xOrigem, aresta.vertice1.y - yOrigem);
      ctxArestas.lineTo(aresta.vertice2.x - xDestino, aresta.vertice2.y + yDestino);
      xFlecha = aresta.vertice1.x + Math.cos(anguloOrigem) * meiaAresta;
      yFlecha = aresta.vertice1.y - Math.sin(anguloOrigem) * meiaAresta;
      anguloFlecha = 90 * Math.PI / 180 - anguloOrigem;
    } else {
      ctxArestas.moveTo(aresta.vertice1.x + xOrigem, aresta.vertice1.y + yDestino);
      ctxArestas.lineTo(aresta.vertice2.x - xDestino, aresta.vertice2.y - yDestino);
      xFlecha = aresta.vertice1.x + Math.cos(anguloOrigem) * meiaAresta;
      yFlecha = aresta.vertice1.y + Math.sin(anguloOrigem) * meiaAresta;
      anguloFlecha = 90 * Math.PI / 180 + anguloOrigem;
    }
  }
  if (aresta.direcionada) {
    var flecha = {x: xFlecha, y: yFlecha, lado: 15, angulo: anguloFlecha};
    desenhaFlecha(flecha);
  }

  if (aresta.valor !== null) {
    desenhaValor(aresta.valor, xFlecha, yFlecha, anguloFlecha);
  }
  ctxArestas.stroke();
}

function desenhaVertices(vertices) {
    for (var vertice of vertices) {
        desenhaVertice(vertice);
    }
}

function desenhaArestas(arestas) {
  for (var aresta of arestas) {
    desenhaAresta(aresta);
  }
}

function desenhaFlecha(flecha) {
  var altura = flecha.lado * Math.sqrt(3) / 2;
  ctxArestas.translate(flecha.x, flecha.y);
  ctxArestas.rotate(flecha.angulo);
  ctxArestas.translate(-flecha.x, -flecha.y);
  ctxArestas.moveTo(flecha.x, flecha.y);
  ctxArestas.lineTo(flecha.x + flecha.lado / 2, flecha.y + altura / 2);
  ctxArestas.lineTo(flecha.x, flecha.y - altura / 2);
  ctxArestas.lineTo(flecha.x - flecha.lado / 2, flecha.y + altura / 2);
  ctxArestas.closePath();
  ctxArestas.fill();
  ctxArestas.setTransform(1, 0, 0, 1, 0, 0);
}

function desenhaValor(valor, x, y, angulo) {
  ctxArestas.translate(x, y);
  ctxArestas.rotate(angulo);
  ctxArestas.translate(-x, -y);
  ctxVertices.stroke();
  ctxVertices.font = "20px Arial";
  ctxVertices.fillText(valor.toString(), x, y);
  ctxArestas.closePath();
  ctxArestas.fill();
  ctxArestas.setTransform(1, 0, 0, 1, 0, 0);
}

function limpaCanvas(ctx) {
  ctx.clearRect(0, 0, canvasVertices.width, canvasVertices.height);
}


canvasArestas.onmousedown = function(e) {
    for (vertice of vertices) {
        var distancia = Math.sqrt((vertice.x - e.pageX) ** 2 + (vertice.y - e.pageY) ** 2);
        if (distancia <= vertice.raio) {
            arrastando = vertice;
            break;
        }
    }
}

canvasArestas.onmousemove = function(e) {
    if (arrastando !== null) {
        arrastando.x = e.pageX;
        arrastando.y = e.pageY;
        if (arrastando.x + arrastando.raio > canvasArestas.width) {
            arrastando.x = canvasArestas.width - arrastando.raio;
        }
        if (arrastando.y + arrastando.raio > canvasArestas.height) {
            arrastando.y = canvasArestas.height - arrastando.raio;
        }
        if (arrastando.x - arrastando.raio < 0) {
            arrastando.x = arrastando.raio;
        }
        if (arrastando.y - arrastando.raio < 0) {
            arrastando.y = arrastando.raio;
        }
    }
}

canvasArestas.onmouseup = function(e) {
    arrastando = null;
    limpaCanvas(ctxVertices);
    desenhaVertices(vertices);
    limpaCanvas(ctxArestas);
    desenhaArestas(arestas);
}

var arrastando = null;
const verticeA = {nome: "A", x: 200, y: 100, raio: RAIO};
const verticeB = {nome: "B", x: 60, y: 200, raio: RAIO};
const verticeC = {nome: "C", x: 250, y: 300, raio: RAIO};
const verticeD = {nome: "D", x: 90, y: 500, raio: RAIO};
const verticeE = {nome: "E", x: 600, y: 200, raio: RAIO};
const verticeF = {nome: "F", x: 450, y: 400, raio: RAIO};
const vertices = [
    verticeA, verticeB, verticeC,
    verticeD, verticeE, verticeF,
];
const arestas = [
  {vertice1: verticeA, vertice2: verticeB, valor: 2, direcionada: DIRECIONADO},
  {vertice1: verticeA, vertice2: verticeE, valor: 1, direcionada: DIRECIONADO},
  {vertice1: verticeC, vertice2: verticeA, valor: 10, direcionada: DIRECIONADO},
  {vertice1: verticeC, vertice2: verticeD, valor: 9, direcionada: DIRECIONADO},
  {vertice1: verticeD, vertice2: verticeB, valor: 9, direcionada: DIRECIONADO},
  {vertice1: verticeB, vertice2: verticeE, valor: 8, direcionada: DIRECIONADO},
  {vertice1: verticeC, vertice2: verticeE, valor: 6, direcionada: DIRECIONADO},
  {vertice1: verticeA, vertice2: verticeD, valor: 4, direcionada: DIRECIONADO},
  {vertice1: verticeE, vertice2: verticeD, valor: 6, direcionada: DIRECIONADO},
  {vertice1: verticeD, vertice2: verticeF, valor: 9, direcionada: DIRECIONADO},
  {vertice1: verticeE, vertice2: verticeF, valor: 10, direcionada: DIRECIONADO},
];

desenhaVertices(vertices);
desenhaArestas(arestas);