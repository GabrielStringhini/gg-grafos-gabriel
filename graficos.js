const canvasVertices = document.getElementById("camada1");
const canvasArestas = document.getElementById("camada2");
const ctxVertices = canvasVertices.getContext("2d");
const ctxArestas = canvasArestas.getContext("2d");

function desenhaVertice(vertice) {
  var raio = 50;

  ctxVertices.beginPath();
  ctxVertices.lineWidth = 2;
  ctxVertices.arc(vertice.x, vertice.y, raio, 0, Math.PI * 2, false);
  ctxVertices.stroke();
  ctxVertices.font = "30px Arial";
  ctxVertices.fillText(vertice.nome, vertice.x - 10, vertice.y + 10);
}

function desenhaAresta(aresta) {
  var anguloOrigem = Math.atan(Math.abs(aresta.vertice2.y - aresta.vertice1.y) / Math.abs(aresta.vertice2.x - aresta.vertice1.x));
  var xOrigem = Math.cos(anguloOrigem) * aresta.vertice1.raio;
  var yOrigem = Math.sin(anguloOrigem) * aresta.vertice1.raio;
  
  var anguloDestino = Math.atan(Math.abs(aresta.vertice2.x - aresta.vertice1.x) / Math.abs(aresta.vertice2.y - aresta.vertice1.y));
  var xDestino = Math.sin(anguloDestino) * aresta.vertice2.raio;
  var yDestino = Math.cos(anguloDestino) * aresta.vertice2.raio;

  // Encontra meio da hipotenusa, onde vai a flecha.
  var comprimentoAresta = Math.sqrt((aresta.vertice2.y - aresta.vertice1.y) ** 2 + (aresta.vertice2.x - aresta.vertice1.x) ** 2);
  var meiaAresta = comprimentoAresta / 2;
  var xFlecha = 0;
  var yFlecha = 0;
  var anguloFlecha = 0;
  
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
      xFlecha = aresta.vertice1.x - Math.cos(anguloOrigem) * meiaAresta;
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
const verticeA = {nome: "A", x: 200, y: 100, raio: 50};
const verticeB = {nome: "B", x: 60, y: 200, raio: 50};
const verticeC = {nome: "C", x: 250, y: 300, raio: 50};
const verticeD = {nome: "D", x: 90, y: 500, raio: 50};
const verticeE = {nome: "E", x: 600, y: 200, raio: 50};
const verticeF = {nome: "F", x: 450, y: 400, raio: 50};
const vertices = [
    verticeA, verticeB, verticeC,
    verticeD, verticeE, verticeF,
];
const arestas = [
  {vertice1: verticeA, vertice2: verticeB, direcionada: true},
  {vertice1: verticeA, vertice2: verticeE, direcionada: true},
  {vertice1: verticeC, vertice2: verticeA, direcionada: true},
  {vertice1: verticeC, vertice2: verticeD, direcionada: true},
  {vertice1: verticeD, vertice2: verticeB, direcionada: true},
  {vertice1: verticeB, vertice2: verticeE, direcionada: true},
  {vertice1: verticeC, vertice2: verticeE, direcionada: true},
  {vertice1: verticeA, vertice2: verticeD, direcionada: true},
  {vertice1: verticeE, vertice2: verticeD, direcionada: true},
  {vertice1: verticeD, vertice2: verticeF, direcionada: true},
  {vertice1: verticeE, vertice2: verticeF, direcionada: true},
];

desenhaVertices(vertices);
desenhaArestas(arestas);