let element = document.getElementById("showTable");
element.onclick = function() {
if (this.value === "Показать таблицу") {
    this.value = "Скрыть таблицу";

for (let key in buildings[0]){
    d3.select("div.table")
    .select("table")
    .insert("th").text(key)
}

    d3.select("div.table")
    .select("table")
    .selectAll("tr")
    .data(buildings)
    .enter()
    .append('tr');

    d3.select("div.table")
    .select("table")
    .selectAll("tr")
    .data(buildings)
    .html( function(d){
        return `<td>${d.Название}</td><td>${d.Тип}</td><td>${d.Страна}</td><td>${d.Город}</td><td>${d.Год}</td><td>${d.Высота}</td><td>${d.Этажность}</td>`;
    })


} else {
    this.value = "Показать таблицу";
    d3.select("div.table")
    .selectAll("th").remove();
    d3.select("div.table")
    .selectAll("tr").remove();
    //.exit()
    //.remove();
    }
};

let compareByYear = function (a, b) {
return (a.Год > b.Год) ? -1 : 1
};
d3.select("table")
.selectAll("tr")
.sort(compareByYear)
/*
data.buildings.sort(compare = function(a, b){
if (a.Год > b.Год){ 
    alert ('HeyyA');
    return 1;
    
}else{
    return -1;
}
});
*/

function getArrGraph(arrObject, fieldX, fieldY) {
    // сформируем список меток по оси OX (различные элементы поля fieldX)
    // группируем по полю fieldX
    let groupObj = d3.group(arrObject, d=>d[fieldX]);//take an element from array d
    arrGroup = []; // массив объектов для построения графика
    for(let entry of groupObj) {
    //выделяем минимальное и максимальное значения поля fieldY in only two elements as min and max
    //для очередной метки по оси ОХ
    let minMax = d3.extent(entry[1].map(d => d[fieldY]));
    let elementGroup = {};

    elementGroup.labelX = entry[0];
    elementGroup.valueMin = minMax[0];
    elementGroup.valueMax = minMax[1];

    arrGroup.push(elementGroup);
}
return arrGroup;
}

function drawGraph(data) {
    // формируем массив для построения диаграммы year or country
    let arrGraph = getArrGraph(buildings, data.ox.value, "Высота")
    let marginX = 50;
    let marginY = 50;
    let height = 400;
    let width = 800;
    let svg = d3.select("svg")
        .attr("height", height)
        .attr("width", width);
    // очищаем svg перед построением
    svg.selectAll("*").remove();

    // определяем минимальное и максимальное значение по оси OY
    let min = d3.min(arrGraph.map(d => d.valueMin)) * 0.95;
    let max = d3.max(arrGraph.map(d => d.valueMax)) * 1.05;
    let xAxisLen = width - 2 * marginX;
    let yAxisLen = height - 2 * marginY;

    // определяем шкалы для осей//сопоставляем оси с текстовыми значениями
    let scaleX = d3.scaleBand()
    .domain(arrGraph.map(function(d) {
        return d.labelX;
        })
    )
    .range([0, xAxisLen],1);
    let scaleY = d3.scaleLinear()
    .domain([min, max])
    .range([yAxisLen, 0]);
    // создаем оси
    let axisX = d3.axisBottom(scaleX); // горизонтальная
    let axisY = d3.axisLeft(scaleY);// вертикальная

    // отображаем ось OX, устанавливаем подписи оси ОX и угол их наклона
    svg.append("g")
    .attr("transform", `translate(${marginX}, ${height - marginY})`)
    .call(axisX)
    .attr("class", "x-axis")
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", function (d) {
    return "rotate(-45)";
    });
    // отображаем ось OY
    svg.append("g")
    .attr("transform", `translate(${marginX}, ${marginY})`)
    .attr("class", "y-axis")
    .call(axisY);
    // создаем набор вертикальных линий для сетки
    d3.selectAll("g.x-axis g.tick")
    .append("line") // добавляем линию
    .classed("grid-line", true) // добавляем класс
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", 0)
    .attr("y2", - (yAxisLen));
    // создаем горизонтальные линии сетки
    d3.selectAll("g.y-axis g.tick")
    .append("line")
    .classed("grid-line", true)
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", xAxisLen)
    .attr("y2", 0);
    
    //по умолчанию выбраны обе высоты и точечная диаграмма
    if ((data.oy_max.checked)&&(data.oy_min.checked)){
        if(!(data.dot.value==="dot")&&!(data.dot.value==="columns")){
            svg.selectAll(".dot")//для максимальной высоты
            .data(arrGraph)
            .enter()
            .append("circle")
            .attr("r", 5)
            .attr("cx", function(d) { return scaleX(d.labelX); })
            .attr("cy", function(d) { return scaleY(d.valueMax); })
            .attr("transform",
            `translate(${marginX + scaleX.bandwidth()/2}, ${marginY})`)
            .style("fill", "red")
            svg.selectAll(".dot")//для минимальной высоты
            .data(arrGraph)
            .enter()
            .append("circle")
            .attr("r", 5)
            .attr("cx", function(d) { return scaleX(d.labelX); })
            .attr("cy", function(d) { return scaleY(d.valueMin); })
            .attr("transform",
            `translate(${marginX + scaleX.bandwidth()/2}, ${marginY})`)
            .style("fill", "blue")
        }else if((data.dot.value==="dot")&&!(data.dot.value==="columns")){
            svg.selectAll(".dot")//для максимальной высоты
            .data(arrGraph)
            .enter()
            .append("circle")
            .attr("r", 5)
            .attr("cx", function(d) { return scaleX(d.labelX); })
            .attr("cy", function(d) { return scaleY(d.valueMax); })
            .attr("transform",
            `translate(${marginX + scaleX.bandwidth()/2}, ${marginY})`)
            .style("fill", "red")
            svg.selectAll(".dot")//для минимальной высоты
            .data(arrGraph)
            .enter()
            .append("circle")
            .attr("r", 5)
            .attr("cx", function(d) { return scaleX(d.labelX); })
            .attr("cy", function(d) { return scaleY(d.valueMin); })
            .attr("transform",
            `translate(${marginX + scaleX.bandwidth()/2}, ${marginY})`)
            .style("fill", "blue")
        }else if(!(data.dot.value==="dot")&&(data.dot.value==="columns")){
            
            group=svg.append("g")
            .attr("transform", `translate(${ marginX}, ${ marginY})`)
            .selectAll(".rect")
            .data(arrGraph)
            .enter().append("rect")
            .attr("x", function(d) { return scaleX(d.labelX); })
            .attr("width", scaleX.bandwidth()-5)
            .attr("y", function(d) { return scaleY(d.valueMax); })
            .attr("height", function(d) { return yAxisLen - scaleY(d.valueMax); })
            .attr("fill", "red");
        }
    } else if ((data.oy_max.checked)&&!(data.oy_min.checked)){
        if (data.dot.value==="dot"){
            svg.selectAll(".dot")//для максимальной высоты
            .data(arrGraph)
            .enter()
            .append("circle")
            .attr("r", 5)
            .attr("cx", function(d) { return scaleX(d.labelX); })
            .attr("cy", function(d) { return scaleY(d.valueMax); })
            .attr("transform",
            `translate(${marginX + scaleX.bandwidth()/2}, ${marginY})`)
            .style("fill", "red")
        } else if(data.dot.value==="columns"){
            group=svg.append("g")
            .attr("transform", `translate(${ marginX}, ${ marginY})`)
            .selectAll(".rect")
            .data(arrGraph)
            .enter().append("rect")
            .attr("x", function(d) { return scaleX(d.labelX); })
            .attr("width", scaleX.bandwidth()-5)
            .attr("y", function(d) { return scaleY(d.valueMax); })
            .attr("height", function(d) { return yAxisLen - scaleY(d.valueMax); })
            .attr("fill", "red");
        }else if (!(data.dot.value==="dot")&&!(data.dot.value==="columns")){
            alert('Выберите тип диаграммы!');
        }
    } else if (!(data.oy_max.checked)&&(data.oy_min.checked)){
        if (data.dot.value==="dot"){
            svg.selectAll(".dot")//для минимальной высоты
            .data(arrGraph)
            .enter()
            .append("circle")
            .attr("r", 5)
            .attr("cx", function(d) { return scaleX(d.labelX); })
            .attr("cy", function(d) { return scaleY(d.valueMin); })
            .attr("transform",
            `translate(${marginX + scaleX.bandwidth()/2}, ${marginY})`)
            .style("fill", "blue")
        } else if(data.dot.value==="columns"){
            group=svg.append("g")
            .attr("transform", `translate(${ marginX}, ${ marginY})`)
            .selectAll(".rect")
            .data(arrGraph)
            .enter().append("rect")
            .attr("x", function(d) { return scaleX(d.labelX); })
            .attr("width", scaleX.bandwidth()-5)
            .attr("y", function(d) { return scaleY(d.valueMin); })
            .attr("height", function(d) { return yAxisLen - scaleY(d.valueMin); })
            .attr("fill", "blue");
        }else if (!(data.dot.value==="dot")&&!(data.dot.value==="columns")){
            alert('Выберите тип диаграммы!');
        }
    } else if (!(data.oy_max.checked)&&!(data.oy_min.checked)){ 
        alert('Значения по оси OY отсутствуют!');
    }          
}


/*element = document.getElementById('showTable');
alert('hi');
element.onclick = function() {
 if (this.value === "Показать таблицу") {

 this.value = "Скрыть таблицу";
 // создать таблицу, вывести ее содержимое
 // см. стр. 9-10 Теоретического материала к ЛР
 d3.js("data.js", function(error, data) {
    if (error) throw error;
  
});
 d3.select("div.table")
 //.select("table").append("tr").data(data.js)
 /*.select("tr").append("td").text('aaaa')
 .select("tr").append("td").text('aaaa')*/
 //.select("table")
 //. …
 // добавить в начало таблицы строку заголовков
 //…

 /*} else {
 this.value = "Показать таблицу";
 // удалить строки таблицы
 d3.select("div.table")
 .select("table")
 //. …
 }
}*/