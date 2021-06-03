function GasWorkModel(xmlData, wrapper, basePath, params) {
    var model;
    this.init = function () {
        model = new modelNS.GasWorkModel({
            xmlData: xmlData,
            wrapper: wrapper,
            basePath: basePath,
            restyling: "title",
            // scalable: false,
            // defaults: {},
            width: wrapper.data('width'),
            height: wrapper.data('height'),
            params: params
        });
        return new modelNS.GasWorkModelView({ model: model }).renderOnShow();
    };
}

modelNS.CommonModel.models.gasWorkModel = GasWorkModel;

modelNS.addLangs({
    ru: {
        // Layout titles
        graphTitle: 'График зависимости',
        diagram: 'Диаграмма',
        curveType: 'Тип кривой',
        curveParams: 'Кривая',
        systemParams: 'Параметры системы',
        gasAtomicity: 'Атомность газа',
    }
});

modelNS.GasWorkModel = modelNS.BaseModel.extend({
    initialize: function (options) {
        modelNS.BaseModel.prototype.initialize.apply(this, arguments);
    },
});

modelNS.GasWorkModelView = modelNS.BaseModelView.extend({
    initialize: function () {
        modelNS.BaseModelView.prototype.initialize.apply(this, arguments);
    },
    render: function () {
        modelNS.BaseModelView.prototype.render.apply(this);
        this.$el.addClass('gasWorkModel');
        this.renderParams();
        this.renderLayout();
        
        this.renderControls();
        this.renderLabels();
        this.renderSvg();
        this.renderDiagram();
        this.renderListener();
        /* 
        
        
        this.renderFunc()
        this.renderUpdateParams()
        
        this.renderUpdateLens()
         */
       /* 
        this.renderDefaults();
         */
    },

    renderLayout: function () {
        this.layout = {};
        var self = this
        this.layout.level1 = new modelNS.DualVerticalLayout({
            parent: self.$el,
            firstPaneWidth: 900, 
        }).render();

        this.layout.leftSide = new modelNS.DualHorizontalLayout({
            parent: self.layout.level1.$firstPane,
            topPaneHeight: 350,  
        }).render();

        this.layout.rightSide = new modelNS.DualHorizontalLayout({
            parent: self.layout.level1.$secondPane,
            topPaneHeight: 350, 
        }).render();


        this.layout.leftSideBottom = new modelNS.DualVerticalLayout({
            parent: self.layout.leftSide.$bottomPane,
            firstPaneWidth: 365, //
        }).render();

        this.layout.leftSideBottomLeft = new modelNS.DualVerticalLayout({
            parent: self.layout.leftSideBottom.$firstPane,
            firstPaneWidth: 170,
        }).render();

        this.layout.leftSideGraph = new modelNS.SingleLayout({
            title: modelNS.lang('graphTitle'),
            parent: self.layout.leftSide.$topPane,
            hasContent: true,
            hasPadding: false,
            nopadding: true,
            columns: 1,
            cls: 'leftSideGraph',
        }).render();

        this.layout.systemParams = new modelNS.SingleLayout({
            title: modelNS.lang('systemParams'),
            parent: self.layout.leftSideBottom.$secondPane,
            hasContent: true,
            hasPadding: false,
            nopadding: true,
            columns: 2,
            cls: 'systemParams',
        }).render();

        this.layout.curveType = new modelNS.SingleLayout({
            title: modelNS.lang('curveType'),
            parent: self.layout.leftSideBottomLeft.$firstPane,
            hasContent: true,
            hasPadding: false,
            nopadding: true,
            columns: 1,
            cls: 'curveType',
        }).render();
        this.layout.curveParams = new modelNS.SingleLayout({
            title: modelNS.lang('curveParams'),
            overflow: false,
            parent: self.layout.leftSideBottomLeft.$secondPane,
            hasContent: true,
            hasPadding: false,
            nopadding: true,
            columns: 1,
            cls: 'curveParams',
        }).render();

        this.layout.curveParamsStraight = new modelNS.SingleLayout({
            parent: self.layout.curveParams.$content,
            hasContent: true,
            hasTitleBar: false,
            hasPadding: false,
            nopadding: true,
            border: false,
            columns: 1,
            cls: 'curveParamsStraight',
        }).render();

        this.layout.curveParamsParabola = new modelNS.SingleLayout({
            parent: self.layout.curveParams.$content,
            hasContent: true,
            border: false,
            hasTitleBar: false,
            hasPadding: false,
            nopadding: true,
            columns: 1,
            cls: 'curveParamsParabola',
        }).render();

        this.layout.curveParamsHyperbola = new modelNS.SingleLayout({
            parent: self.layout.curveParams.$content,
            hasContent: true,
            border: false,
            hasTitleBar: false,
            hasPadding: false,
            nopadding: true,
            columns: 1,
            cls: 'curveParamsHyperbola',
        }).render();

        this.layout.curveParamsExponent = new modelNS.SingleLayout({
            parent: self.layout.curveParams.$content,
            hasContent: true,
            border: false,
            hasTitleBar: false,
            hasPadding: false,
            nopadding: true,
            columns: 1,
            cls: 'curveParamsExponent',
        }).render();

        this.layout.rightDiagram = new modelNS.SingleLayout({
            title: modelNS.lang('diagram'),
            parent: self.layout.rightSide.$topPane,
            hasContent: true,
            hasPadding: false,
            nopadding: true,
            columns: 1,
            cls: 'gasDiagram',
        }).render();

        this.layout.gasAtomicity = new modelNS.SingleLayout({
            title: modelNS.lang('gasAtomicity'),
            parent: self.layout.rightSide.$bottomPane,
            hasContent: true,
            hasPadding: false,
            nopadding: true,
            columns: 1,
            cls: 'gasAtomicity',
        }).render();

    },
    renderControls: function () {
        var self = this;

        
        // Straight
        self.label.formulaStraight = new modelNS.LabelView({
            parent: self.layout.curveParamsStraight.$content,
            cls: '',
            text: '<span class="italicText">y</span> = <span class="italicText">kx + b</span>',
        }).render();
        self.label.paramKStraight = new modelNS.LabelView({
            parent: self.layout.curveParamsStraight.$content,
            cls: '',
            text: '<span class="italicText">k</span> = {%d}',
        }).render();
        self.label.paramBStraight = new modelNS.LabelView({
            parent: self.layout.curveParamsStraight.$content,
            cls: '',
            text: '<span class="italicText">b</span> = {%d}',
        }).render();

        // Parabola
        self.label.formulaParabola = new modelNS.LabelView({
            parent: self.layout.curveParamsParabola.$content,
            cls: '',
            text: '<span class="italicText">y</span> = <span class="italicText">ax<sup>2</sup> + bx + c</span>',
        }).render();
        self.control.inputParabola = new modelNS.Input({
            parent: self.layout.curveParamsParabola.$content,
            fixed: 2,
            value: self.parabola.a,
            step: 0.05,
            min: -0.35, 
            max: 0.00,
            inputType: 'number',
            width: 85,
            label: '<span class="italicText">a</span> = ',
            labelAfter: '<span>&middot;10<sup>−2</sup></span>',
            row: true,
        }).render();  
        self.label.paramBParabola = new modelNS.LabelView({
            parent: self.layout.curveParamsParabola.$content,
            cls: 'paramBParabola',
            width: 90,
            text: '<span class="italicText">b</span>={%d}',
        }).render();
        self.label.paramCParabola = new modelNS.LabelView({
            parent: self.layout.curveParamsParabola.$content,
            cls: 'paramCParabola',
            width: 90,
            text: '<span class="italicText">c</span>={%d}',
        }).render();

        // Hyperbola
        self.label.formulaHyperbola = new modelNS.LabelView({
            parent: self.layout.curveParamsHyperbola.$content,
            cls: 'fractionLabel',
            text: '<span class="italicText">y</span> = <span class="italicText"><span class="fraction">k/x</span> + b</span></span>',
        }).render();
        // создаем и смещаем дробь
        $('.fraction').each(function(key, value) {
            $this = $(this)
            var split = $this.html().split("/")
            if( split.length == 2 ){
                $this.html('<span class="top">'+split[0]+'</span><span class="bottom">'+split[1]+'</span>')
            }    
        });

        self.label.paramKHyperbola = new modelNS.LabelView({
            parent: self.layout.curveParamsHyperbola.$content,
            cls: '',
            text: '<span class="italicText">k</span> = {%d}',
        }).render();
        self.label.paramBHyperbola = new modelNS.LabelView({
            parent: self.layout.curveParamsHyperbola.$content,
            cls: '',
            text: '<span class="italicText">b</span> = {%d}',
        }).render();

        // Exponent
        self.label.formulaExponent = new modelNS.LabelView({
            parent: self.layout.curveParamsExponent.$content,
            cls: '',
            text: '<span class="italicText">y</span> = <span class="italicText">ae<sup>&gamma;x</sup> + b</span></span>',
        }).render();
        self.control.inputExponent = new modelNS.Input({
            parent: self.layout.curveParamsExponent.$content,
            cls: 'inputExponent',
            value: self.exponent.c.toFixed(3),
            fixed: 3,
            step: 0.002,
            min: 0.010, 
            max: 0.030,
            inputType: 'number',
            width: 90,
            label: '<span>&gamma;</span> = ',
            row: true,
        }).render();  
        self.label.paramAExponent = new modelNS.LabelView({
            parent: self.layout.curveParamsExponent.$content,
            title: modelNS.lang('paramExponent'),
            width: 90,
            cls: '',
            text: '<span class="italicText">a</span>={%d}',
        }).render();
        self.label.paramBExponent = new modelNS.LabelView({
            parent: self.layout.curveParamsExponent.$content,
            title: modelNS.lang('paramExponent'),
            width: 90,
            cls: 'paramBExponent',
            text: '<span class="italicText">b</span>={%d}',
        }).render();

        self.control.atomicity = new modelNS.RadioButtonGroup({
            collection: new modelNS.RadioButtonCollection([
                {
                    label: 'Одноатомный', value: 1,
                    checked: true,
                    onCheck: function () {
                        self.data.i = 3
                    }
                },
                {
                    label: 'Двухатомный', value: 0,
                    onCheck: function () {
                        self.data.i = 5
                    }
                },
                {
                    label: 'Многоатомный', value: 0,
                    onCheck: function () {
                        self.data.i = 6
                    }
                },
            ]),
            parent: self.layout.gasAtomicity.$content,
            columns: 1,
            verticalAlign: 'middle'
        }).render();
        
    },
    renderLabels: function () {
        var self = this;
        self.label.volume = new modelNS.LabelView({
            title: modelNS.lang('volumeLabel'),
            cls: '',
            text: '<span class="italicText">V</span> = {%d} дм<sup>3</sup>',
            parent: self.layout.systemParams.$content,
        }).render();

        self.label.heatQuantity = new modelNS.LabelView({
            title: modelNS.lang('heatQuantityLabel'),
            cls: '',
            text: '<span class="italicText">Q</span> = {%d} кДж',
            parent: self.layout.systemParams.$content,
        }).render();

        self.label.pressure = new modelNS.LabelView({
            title: modelNS.lang('pressureLabel'),
            cls: '',
            text: '<span class="italicText pressureLabel">p</span> = {%d} кПа',
            parent: self.layout.systemParams.$content,
        }).render();

        self.label.gasWork = new modelNS.LabelView({
            title: modelNS.lang('gasWorkLabel'),
            cls: 'gasWorkLabel',
            text: '<span class="italicText">A</span> = {%d} кДж',
            parent: self.layout.systemParams.$content,
        }).render();

        self.label.temperature = new modelNS.LabelView({
            title: modelNS.lang('temperatureLabel'),
            cls: '',
            text: '<span class="italicText">T</span> = {%d} K',
            parent: self.layout.systemParams.$content,
        }).render();

        self.label.internalEnergy = new modelNS.LabelView({
            title: modelNS.lang('internalEnergyLabel'),
            cls: 'internalEnergyLabel',
            text: '<span class="greekText">&Delta;</span>U<span> = {%d} кДж',
            parent: self.layout.systemParams.$content,
        }).render();
    },

    renderParams: function () {
        var self = this;
        window.RRL = self; // для доступа из глобального объекта window
        self.defaults = {}; // стартовые значения
        self.const = { 
                        height: 310,
                        width: 700,
                        svgMargin: 30,
                        xAxisLength: 640,
                        yAxisLength: 250,
                        xValMax: 260,
                        yValMax: 50  }
        self.diagram = {
            height: 310,
            width: 150,
            svgMargin: 32,
            xAxisLength: 150,
            yAxisLength: 265,
            xValMax: 100,
            yValMax: 50,
            yValMin: -50,
            
        }
        self.diagram.scales = {
            scaleX: d3.scaleLinear()
                    .domain([0, 15])
                    .range([0, 160]),
            scaleY: d3.scaleLinear()
                        .domain([self.diagram.yValMin, self.diagram.yValMax])
                        .range([self.diagram.yAxisLength, 0]),
        }
        var margin = self.const.svgMargin
        
        self.scales = {
            scaleX: d3.scaleLinear()
                        .domain([0, self.const.xValMax])
                        .range([0, self.const.xAxisLength]),
            scaleY: d3.scaleLinear()
                        .domain([self.const.yValMax, 0])
                        .range([0, self.const.yAxisLength]),

            unScaleX: d3.scaleLinear()
                        .domain([0, self.const.xAxisLength])
                        .range([0, self.const.xValMax]),
            unScaleY: d3.scaleLinear()
                        .domain([0, self.const.yAxisLength])
                        .range([self.const.yValMax, 0]),
            scaleYLinear: d3.scaleLinear()
                            .domain([0, self.const.yValMax])
                            .range([0, self.const.yAxisLength])
        } 
        self.data = {
            isFirstCircle: true,
            curve: 'straight',
            V1: 100,
            V2: 200,
            p1: 13,
            p2: 20,
            T1: 13*100/8.31,
            T2: 20*200/8.31,
            p: 0,
            V: 0,
            T: 0,
            Q: 0,
            A: 0,
            U: 0,
            i: 3,
        }
        self.dataMinMax = {
            pMax: 5,
            pMin: 50,
            V1Min: 20,
            V1Max: 210,
            V2Min: 60,
            V2Max: 250,
            distance: 50,
        }
        self.dataMinMaxScaled = {
            pMax: self.scales.scaleY(self.dataMinMax.pMax)+margin,
            pMin: self.scales.scaleY(self.dataMinMax.pMin)+margin,
            V1Min: self.scales.scaleX(self.dataMinMax.V1Min)+margin,
            V1Max: self.scales.scaleX(self.dataMinMax.V1Max)+margin,
            V2Min: self.scales.scaleX(self.dataMinMax.V2Min)+margin,
            V2Max: self.scales.scaleX(self.dataMinMax.V2Max)+margin,
            distance: self.scales.scaleX(self.dataMinMax.distance),
            y0: self.scales.scaleY(0)+margin,
        }

        self.straight = {
            k: 0,
            b: 0
        },
        self.parabola = {
            a: -0.35,
            b: 0,
            c: 0
        },
        self.hyperbola = {
            k: 0,
            b: 0
        },
        self.exponent = {
            a: 0,
            b: 0,
            c: 0.010,
        },
        self.graphVarray = []

        self.animation = {
            started: false,
            currentPointV: 0,
            points: [],
            values: [],
            ms: 50,
            frames: 60,
            pauseIndex: 0
        }

        for (var i=78; i<= 670; i=i+4) {
            self.graphVarray.push({x: i, y: 0})
        }
        self.func = { help: 'functions' };
        self.updateFunc = { help: 'functions for updating values' };
        
        self.help = {}; // подсказки
        self.control = {}; // элементы управления
        self.label = {};
        self.svg = {};
        
        self.params = {  }  // параметры для формул
        self.defaults = {};
    },
    renderDiagram: function() {
        var self = this
        var line = d3.line()
                        .x(function(d){return d.x})
                        .y(function(d){return d.y});
        
        var height = self.diagram.height, 
            width = self.diagram.width, 
            margin = self.diagram.svgMargin;
        // создание объекта svg диаграммы
        var diagram = d3.select(self.layout.rightDiagram.$content[0]).append("svg")
                .attr("id", "gasDiagram")
                .attr("class", "axis")
                .attr("width", width)
                .attr("height", height)
                .attr("overflow", 'hidden');
        // длина оси X= ширина контейнера svg - отступ слева и справа
        var xAxisLength = self.diagram.xAxisLength;     
        // длина оси Y = высота контейнера svg - отступ сверху и снизу
        var yAxisLength = self.diagram.yAxisLength;
        var scaleX = self.diagram.scales.scaleX
        var scaleY = self.diagram.scales.scaleY
        // создаем ось X   
        var xAxis = d3.axisBottom()
                    .scale(scaleX)
                  
        // создаем ось Y             
        var yAxis = d3.axisLeft()
                    .scale(scaleY)

        xAxis.ticks(3)
        //yAxis.ticks(10)  
        // отрисовка оси Х             
        var xAxis = diagram.append("g")       
            .attr("class", "x-axis")
            .attr("transform",  // сдвиг оси вниз и вправо
                "translate(" + margin + "," + (height - margin-11) + ")")
            .call(xAxis)

        // отрисовка оси Y 
        var yAxis = diagram.append("g")       
            .attr("class", "y-axis")
            .attr("transform", // сдвиг оси вниз и вправо на margin
                    "translate(" + margin + "," + (margin-15) + ")")
            .call(yAxis);
        // перекрашиваем оси
        diagram.selectAll("g.tick line").style("stroke", "#7C8EAA")
        
        diagram.selectAll(".domain").style("stroke", "#7C8EAA")
        // создаем набор вертикальных линий для сетки   
        diagram.selectAll("g.x-axis g.tick")
                .append("line").style("stroke", "#CCCCCC")
                .classed("grid-line", true)
                .attr("x1", 0)
                .attr("y1", 0)
                .attr("x2", 0)
                .attr("y2", - (yAxisLength));
                
        // рисуем горизонтальные линии координатной сетки
        diagram.selectAll("g.y-axis g.tick")
            .append("line").style("stroke", "#CCCCCC")
            .classed("grid-line", true)
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", xAxisLength)
            .attr("y2", 0);
        //скрываем значения на Х оси
        diagram.selectAll("g.x-axis g.tick text").style('opacity', 0)
        // добавляем надписи
        diagram.append("text")
            .attr("y", height-margin+10)
            .attr("x", -5+margin*2)
            .attr('text-anchor', 'middle')
            .attr("class", "italicText graphText")
            .text("Q");
        diagram.append("text")
            .attr("y", height-margin+10)
            .attr("x", -15+margin*4)
            .attr('text-anchor', 'middle')
            .attr("class", "italicText graphText")
            .text("A");
        diagram.append("text")
            .attr("y", height-margin+10)
            .attr("x", -2+margin*5)
            .attr('text-anchor', 'middle')
            .attr("class", "graphText")
            .text("Δ");
        diagram.append("text")
            .attr("y", height-margin+10)
            .attr("x", -20+margin*6)
            .attr('text-anchor', 'middle')
            .attr("class", "italicText graphText")
            .text("U");
        // добавляем шкалы
    },
    renderSvg: function () { 
        var self = this;
        var line = d3.line()
                        .x(function(d){return d.x})
                        .y(function(d){return d.y});
        
        var height = self.const.height, 
            width = self.const.width, 
            margin = self.const.svgMargin,
            data=[];
        // создание объекта svg графика
        var svg = d3.select(self.layout.leftSideGraph.$content[0]).append("svg")
                .attr("id", "mainGraph")
                .attr("class", "axis")
                .attr("width", width)
                .attr("height", height)
                .attr("overflow", 'hidden');
        var layer1 = svg.append('g').attr("id", "layer1")
        var layer2 = svg.append('g').attr("id", "layer2")
        var layer3 = svg.append('g').attr("id", "layer3")

        // длина оси X= ширина контейнера svg - отступ слева и справа
        var xAxisLength = self.const.xAxisLength;     
        // длина оси Y = высота контейнера svg - отступ сверху и снизу
        var yAxisLength = self.const.yAxisLength;
        // функции интерполяции значений
        var scaleX = self.scales.scaleX
        var unScaleX = self.scales.unScaleX 
        var scaleY = self.scales.scaleY
        var scaleYLinear = self.scales.scaleYLinear
              
        var markerBoxWidth = 20
        var markerBoxHeight = 8
        var refX = markerBoxWidth / 2
        var refY = markerBoxHeight / 2
        var arrowPoints = [[0, markerBoxHeight], 
                            [markerBoxWidth, markerBoxHeight/2], [0, 0], 
                            [0, markerBoxHeight]];   

        svg.append('defs')
            .append('marker')
            .attr('id', 'arrow')
            .attr('viewBox', [0, 0, markerBoxWidth, markerBoxHeight])
            .attr('refX', refX)
            .attr('refY', refY)
            .attr('markerWidth', markerBoxWidth)
            .attr('markerHeight', markerBoxHeight)
            .attr('orient', 'auto-start-reverse')
            .style('fill', '#7C8EAA')
            .append('path')
            .attr('d', d3.line()(arrowPoints))
        // создаем ось X   
        var xAxis = d3.axisBottom()
                    .scale(scaleX)
                  
        // создаем ось Y             
        var yAxis = d3.axisLeft()
                    .scale(scaleY)
        xAxis.ticks(13)
        yAxis.ticks(10)  
        // отрисовка оси Х             
        var xAxis = layer2.append("g")       
            .attr("class", "x-axis")
            .attr("transform",  // сдвиг оси вниз и вправо
                "translate(" + margin + "," + (height - margin) + ")")
            .call(xAxis)

        // отрисовка оси Y 
        var yAxis = layer2.append("g")       
            .attr("class", "y-axis")
            .attr("transform", // сдвиг оси вниз и вправо на margin
                    "translate(" + margin + "," + (margin) + ")")
            .call(yAxis);

        // перекрашиваем оси
        svg.selectAll("g.tick line").style("stroke", "#7C8EAA")
        
        svg.selectAll(".domain").style("stroke", "#7C8EAA")
       // создаем набор вертикальных линий для сетки   
        svg.selectAll("g.x-axis g.tick")
            .append("line").style("stroke", "#CCCCCC")
            .classed("grid-line", true)
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", 0)
            .attr("y2", - (yAxisLength));
            
        // рисуем горизонтальные линии координатной сетки
        svg.selectAll("g.y-axis g.tick")
            .append("line").style("stroke", "#CCCCCC")
            .classed("grid-line", true)
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", xAxisLength)
            .attr("y2", 0);

        var clone1 = svg.select('.x-axis').clone(true)
        svg.select(".x-axis")
                .each(function() { layer1.append(() => this); });
        layer2.select(".x-axis").remove()
        layer2.append("path").attr('id', 'workElem')
        // создаем линию графика
        layer2.append("path")
            .attr("d", '').attr("id", 'mainCurve')
            .style("stroke-width", 2).style("fill", 'none')
            .style("stroke", '#0000FF')
        //layer1.append(clone1)
        // ось х и y со стрелкой
        var dataX = [{x: margin, y: height-margin+1}, {x: width-(margin/2.2), y: height-margin+1}]
        var dataY = [{x: margin+1, y: height-margin}, {x: margin+1, y: margin/2.5}]
        layer2.append("path")
            .attr('id', 'xLine')
            .attr("d", line(dataX))
            .style("stroke", '#7C8EAA')
            .style("stroke-width", 1)
            .attr('marker-end', 'url(#arrow)')
        layer2.append("path")
            .attr('id', 'yLine')
            .attr("d", line(dataY))
            .style("stroke", '#7C8EAA')
            .style("stroke-width", 1)
            .attr('marker-end', 'url(#arrow)') 
        // создаем круги
        // круг для анимации
        layer3.append("circle")
            .attr("id", 'circle0')
            .style("fill", "blue")
            .style("stroke", "black")
            .style("stroke-width", 1)
            .style("cursor", 'pointer')
            .attr("r", 6)
            .attr("cx", 100)
            .attr("cy", -100)
        layer3.append("circle")
            .attr("id", 'circle1')
            .style("fill", "red")
            .style("stroke", "black")
            .style("stroke-width", 1)
            .style("cursor", 'pointer')
            .attr("r", 6)
            .attr("cx", 210)
            .attr("cy", 200)
        layer3.append("circle")
            .attr("id", 'circle2')
            .style("fill", "green")
            .style("stroke", "black")
            .style("stroke-width", 1)
            .style("cursor", 'pointer')
            .attr("r", 6)
            .attr("cx", 222)
            .attr("cy", 233)
        // создаем надписи для осей
        var pDist = margin+20
        layer2.append("text")
            .attr("y", 5+margin/2)
            .attr("x", pDist)
            .attr('text-anchor', 'middle')
            .attr("class", "italicText graphText")
            .text("p,");
        layer2.append("text")
            .attr("y", 5+margin/2)
            .attr("x", pDist+28)
            .attr('text-anchor', 'middle')
            .attr("class", "graphText")
            .text("кПа");
        var Vdist = width-margin-35
        layer2.append("text")
            .attr("y", height-margin-10)
            .attr("x", Vdist)
            .attr('text-anchor', 'middle')
            .attr("class", "italicText graphText")
            .text("V,");
        layer2.append("text")
            .attr("y", height-margin-10)
            .attr("x", Vdist+26)
            .attr('text-anchor', 'middle')
            .attr("class", "graphText")
            .text("дм");
        layer2.append("text")
            .attr("y", height-margin-22)
            .attr("x", Vdist+42)
            .attr('text-anchor', 'middle')
            .attr("class", "")
            .text("3");
        
        
        
    },

    blockOrUnblockControls: function (bool) {
        var self = this;
        if (bool) {
            self.control.inputParabola.disable()
            self.control.inputExponent.disable()
            self.control.curveType.disable()
            self.control.atomicity.disable()
        } else {
            self.control.inputParabola.enable()
            self.control.inputExponent.enable()
            self.control.curveType.enable()
            self.control.atomicity.enable()
        }
    }, 
    switchTooltips: function() {
        var self = this;
        d3.select('#circle1 title').remove()
        d3.select('#circle2 title').remove()
        if (self.data.isFirstCircle) {
            d3.select('#circle1').append('title').text('Начальное положение')
            d3.select('#circle2').append('title').text('Конечное положение')
        } else {
            d3.select('#circle2').append('title').text('Начальное положение')
            d3.select('#circle1').append('title').text('Конечное положение')
        } 
    },
    updateParams: function () {
        var self = this;
        var data = self.data
        if (self.animation.started) {
            var curve = data.curve
            var dataCurve = self[curve]
            var formulasObj = gasWorkCalcs[curve]
            var args;
            if (curve === 'straight' || curve === 'hyperbola') {
                args = [dataCurve.k, dataCurve.b]
            } else {
                args = [dataCurve.a, dataCurve.b, dataCurve.c]
            }
            data.T = data.p*data.V/8.31
            data.A = formulasObj.area(data.V1, data.V, ...args)/1000
            data.U = ((data.i*data.T*8.31)/2000) - ((data.i*data.T1*8.31)/2000)
            if (!data.isFirstCircle) {
                data.A = -data.A
                data.U = -data.U
            }
            data.Q = data.U + data.A
            
        } else {
            data.T = 0
            data.A = 0
            data.U = 0
            data.Q = 0
        }  
    }, 

    updateVpTlabels: function(V, p, T) {
        var self = this;
        self.label.volume.set({d: V.toFixed()})
        self.label.pressure.set({d: p.toFixed(2).toString().replace(/\./, ',')})
        self.label.temperature.set({d: T.toFixed()})
    },

    updateEnergyLabels: function() {
        var self = this;
        self.label.internalEnergy.set({d: self.data.U.toFixed(2).toString().replace(/\./, ',')})
        self.label.gasWork.set({d: self.data.A.toFixed(2).toString().replace(/\./, ',')})
        self.label.heatQuantity.set({d: self.data.Q.toFixed(2).toString().replace(/\./, ',')})
    },

    updateCurveParamsAndLabels: function(data) {
        var self = this;
        var curve = self.data.curve
        var formulasObj = gasWorkCalcs[curve]
        switch (curve) {
            case 'straight':
                var k = self.straight.k = formulasObj.k(data.V1, data.p1, data.V2, data.p2)
                var b = self.straight.b = formulasObj.b(data.V1, data.p1, data.V2, data.p2)
                self.label.paramKStraight.set({d: k.toFixed(2).toString().replace(/\./, ',')})
                self.label.paramBStraight.set({d: b.toFixed(2).toString().replace(/\./, ',')})
                break
            case 'parabola':
                var b = self.parabola.b = formulasObj.b(data.V1, data.p1, data.V2, data.p2, self.parabola.a/100)
                var c = self.parabola.c = formulasObj.c(data.V1, data.p1, data.V2, data.p2, self.parabola.a/100)
                self.label.paramBParabola.set({d: b.toFixed(1).toString().replace(/\./, ',')})
                self.label.paramCParabola.set({d: c.toFixed(1).toString().replace(/\./, ',')})
                break
            case 'hyperbola':
                var k = self.hyperbola.k = formulasObj.k(data.V1, data.p1, data.V2, data.p2)
                var b = self.hyperbola.b = formulasObj.b(data.V1, data.p1, k)
                self.label.paramKHyperbola.set({d: k.toFixed(2).toString().replace(/\./, ',')})
                self.label.paramBHyperbola.set({d: b.toFixed(2).toString().replace(/\./, ',')})
                break
            case 'exponent':
                var a = self.exponent.a = formulasObj.a(data.V1, data.p1, data.V2, data.p2, self.exponent.c)
                var b = self.exponent.b = formulasObj.b(data.V1, data.p1, self.exponent.c, a)
                self.label.paramAExponent.set({d: a.toFixed(1).toString().replace(/\./, ',')})
                self.label.paramBExponent.set({d: b.toFixed(1).toString().replace(/\./, ',')})
                break
        }
    },

    updateCurve: function(mainCurve, line, scaleY, unScaleX, margin) {
        var self = this;
        var curve = self.data.curve
        var data = self[curve]
        var formulasObj = gasWorkCalcs[curve]
        var graphVarray = self.graphVarray
        var args = curve
        var pointsArray = []
        if (curve === 'straight' || curve === 'hyperbola') {
            args = [data.k, data.b]
        } else {
            args = [data.a, data.b, data.c]
        }
        
        for (var i=0; i <= 148; i++) {
            var obj = graphVarray[i]
            var y = formulasObj.y(unScaleX(obj.x-margin), ...args)
            if (y >= 0) {
                pointsArray.push({x: obj.x, y: scaleY(y)+margin})
            }
            
            /* obj.y =
            scaleY(y)+margin */
        }
        mainCurve.attr("d", line(pointsArray))
    },

    renderListener: function () {
        var self = this;
        var margin = self.const.svgMargin
        var scaleX = self.scales.scaleX
        var scaleY = self.scales.scaleY
        var unScaleX = self.scales.unScaleX
        var unScaleY = self.scales.unScaleY
        var scaleYLinear = self.scales.scaleYLinear
        var data = self.data
        var animation = self.animation
        var fence = self.dataMinMaxScaled
        var mainCurve = d3.select('#mainCurve')
        var workElem = d3.select('#workElem')
        var animationCircle = d3.select('#circle0')
        var line = d3.line()
                        .x(function(d){return d.x})
                        .y(function(d){return d.y});
        var drag = {
            dragX1: 0,
            dragY1: 0,
            dragX2: 0,
            dragY2: 0,
        }
        
        svg = d3.select('#mainGraph')
        self.dragTarget = 0
        // стартовые значения лейблов и точек
        self.updateVpTlabels(data.V1, data.p1, data.T1)
        self.updateEnergyLabels()
        self.updateCurveParamsAndLabels(data)
        self.updateCurve(mainCurve, line, scaleY, unScaleX, margin)
        self.switchTooltips()

        var circle1 = d3.select('#circle1')
                    .attr("cx", scaleX(data.V1)+margin)
                    .attr("cy", scaleY(data.p1)+margin);
        var circle2 = d3.select('#circle2')
                    .attr("cx", scaleX(data.V2)+margin)
                    .attr("cy", scaleY(data.p2)+margin); 
        // перемещение точек
        self.dragHandler = d3.drag()
                            .on('start', function () {
                                if (d3.event.sourceEvent.path[0].id === 'circle1') {
                                    data.isFirstCircle = true
                                    self.dragTarget = '1'
                                    self.updateVpTlabels(data.V1, data.p1, data.T1)
                                    self.switchTooltips()
                                } else {
                                    data.isFirstCircle = false
                                    self.dragTarget = '2'
                                    self.updateVpTlabels(data.V2, data.p2, data.T2)
                                    self.switchTooltips()
                                }
                            })
                            .on("drag", function (d) {
                                    var x = d3.event.x
                                    var y = d3.event.y
                                
                                    var target2 = data.isFirstCircle ? 2 : 1
                                    var x2 = scaleX(data['V'+target2])+margin
 
                                    var Vnum = 'V'+self.dragTarget
                                    var pnum = 'p'+self.dragTarget
                                    var Tnum = 'T'+self.dragTarget
                                    var distanceBool = data.isFirstCircle ? x2-x >= fence.distance :
                                                                            x-x2 >= fence.distance
                                    if (x <= fence[Vnum+'Max'] && 
                                        x >= fence[Vnum+'Min'] && distanceBool) {
                                            data[Vnum] = unScaleX(x-margin)
                                            d3.select(this)
                                                .attr("cx", x)
                                        }
                                    if (y <= fence['pMax'] && 
                                        y >= fence['pMin']) {
                                            data[pnum] = unScaleY(y-margin)
                                            
                                            d3.select(this)
                                                .attr("cy", y);
                                        }
                                    data[Tnum] = data[Vnum]*data[pnum]/8.31
                                    self.updateVpTlabels(data[Vnum], data[pnum], data[Tnum])
                                    self.updateCurveParamsAndLabels(data)
                                    
                                    self.updateCurve(mainCurve, line, scaleY, unScaleX, margin)
                                
                            }).on('end', function () {

                                    if (self.data.curve) {
                                        var y = d3.event.y
                                        var target2 = data.isFirstCircle ? 2 : 1
                                        var pnum = 'p'+self.dragTarget
                                        var y0 = gasWorkCalcs.parabola.y0(self.parabola.a, self.parabola.b, self.parabola.c)
                                        var Vnum = 'V'+self.dragTarget
                                        var pnum = 'p'+self.dragTarget
                                        var Tnum = 'T'+self.dragTarget
                                        
                                        if (y0 > 55) {
                                            console.log(y+margin, scaleY(y0)+margin)
                                             y = y - (scaleY(y0)*2+margin)
                                            data[pnum] = unScaleY(y-margin)
                                            data[Tnum] = data[Vnum]*data[pnum]/8.31

                                            d3.select(this)
                                                .attr("cy", y); 
                                            
                                            self.updateVpTlabels(data[Vnum], data[pnum], data[Tnum])
                                            self.updateCurveParamsAndLabels(data)
                                            
                                            self.updateCurve(mainCurve, line, scaleY, unScaleX, margin)
                                        }
                                    }
                            })

        self.dragHandler(svg.select("#circle1"));
        self.dragHandler(svg.select("#circle2"));

        self.listenTo(self.control.inputParabola, 'Change', function (value) {
            self.parabola.a = +value
            var val = +value
            self.control.inputParabola.setText(val.toFixed(2))
            self.updateCurveParamsAndLabels(data)
            self.updateCurve(mainCurve, line, scaleY, unScaleX, margin)
        })
        self.listenTo(self.control.inputExponent, 'Change', function (value) {
            self.exponent.c = +value
            var val = +value
            self.control.inputExponent.setText(val.toFixed(3))
            self.updateCurveParamsAndLabels(data)
            self.updateCurve(mainCurve, line, scaleY, unScaleX, margin)
        })
        self.control.curveType = new modelNS.RadioButtonGroup({
            collection: new modelNS.RadioButtonCollection([
                {
                    label: 'Прямая', value: 1,
                    checked: true,
                    onCheck: function () {
                        self.data.curve = 'straight'
                        self.updateCurveParamsAndLabels(self.data)
                        self.updateCurve(mainCurve, line, scaleY, unScaleX, margin)
                        $(self.layout.curveParams.$content).prepend(self.layout.curveParamsStraight.$el)
                    }
                },
                {
                    label: 'Парабола', value: 0,
                    onCheck: function () {
                        self.data.curve = 'parabola'
                        self.updateCurveParamsAndLabels(self.data)
                        self.updateCurve(mainCurve, line, scaleY, unScaleX, margin)
                        $(self.layout.curveParams.$content).prepend(self.layout.curveParamsParabola.$el)
                    }
                },
                {
                    label: 'Гипербола', value: 0,
                    onCheck: function () {
                        self.data.curve = 'hyperbola'
                        self.updateCurveParamsAndLabels(self.data)
                        self.updateCurve(mainCurve, line, scaleY, unScaleX, margin)
                        $(self.layout.curveParams.$content).prepend(self.layout.curveParamsHyperbola.$el)
                    }
                },
                {
                    label: 'Экспонента', value: 0,
                    onCheck: function () {
                        self.data.curve = 'exponent'
                        self.updateCurveParamsAndLabels(self.data)
                        self.updateCurve(mainCurve, line, scaleY, unScaleX, margin)
                        $(self.layout.curveParams.$content).prepend(self.layout.curveParamsExponent.$el)
                    }
                }
            ]),
            parent: self.layout.curveType.$content,
            columns: 1,
            verticalAlign: 'middle'
        }).render();
        
        self.playerControls = new modelNS.PlayerControls({
			parent : self.layout.leftSideGraph.$head,
		}).render();
        
        this.listenTo(this.playerControls, 'Play', function () {
            play();
            //this.playerControls.showPause();
        });

        this.listenTo(this.playerControls, 'Pause', function () {
            pause();
        });

        this.listenTo(this.playerControls, 'Stop', function () {
            stop();
        });
        this.listenTo(this.playerControls, 'Prev', function () {
            stop();
        });
        this.listenTo(this.playerControls, 'Next', function () {
            next();
        });
        function play() {
            self.blockOrUnblockControls(true)
            svg.select("#circle1").on('mousedown.drag', null);
            svg.select("#circle2").on('mousedown.drag', null);
            var curve = self.data.curve
            var formulasObj = gasWorkCalcs[curve]
            var args;
            var data = self.data
            var curveData = self[curve]
            animation.points = []
            if (curve === 'straight' || curve === 'hyperbola') {
                args = [curveData.k, curveData.b]
            } else {
                args = [curveData.a, curveData.b, curveData.c]
            }
            
            var point1 = data.V1
            var point2 = data.V2
            
            var tick = (point2 - point1)/animation.frames

            
            for (var i=0; i <= animation.frames; i++) {
                var V = point1 + (tick*i)
                var p = formulasObj.y(V, ...args)
                animation.points.push({x: scaleX(V)+margin, y: scaleY(p)+margin})
                animation.values.push({V: V, p: p})
            }
            
            var j;
            if (animation.started) {
                j = animation.pauseIndex
            } else {
                j = 1
            }
            var y0 = fence.y0
            animation.started = true
            var animTicksLen = animation.points.slice(j, animation.points.length).length+1
            if (!data.isFirstCircle) {
                animation.points.reverse()
            }
            var dataNum = data.isFirstCircle ? 1 : 2
            self.timer = setInterval(function() {
                
                data.V = animation.values[j-1].V
                data.p = animation.values[j-1].p
                var slice = animation.points.slice(0, j)
                var len = slice.length ? slice.length-1 : slice.length
               
                var x = slice[len].x
                
                var points = [{x: x, y: y0},
                                {x: scaleX(data['V'+dataNum])+margin, y: y0},
                                {x: scaleX(data['V'+dataNum])+margin, y: scaleY(data['p'+dataNum])+margin},
                                ...slice]

                workElem.attr("d", line(points))
                animationCircle.attr("cx", x).attr("cy", slice[len].y)
                animation.pauseIndex = j
                j++
                
                self.updateParams()
                self.updateVpTlabels(data.V, data.p, data.T)
                self.updateEnergyLabels()
            }, animation.ms)

            self.timerTimeout = setTimeout(function() {
                clearInterval(self.timer)
            }, animation.ms*(animTicksLen))
        }

        function pause() {
            clearInterval(self.timer)
            clearTimeout(self.timerTimeout)
            animation.points = []
            animation.values = []
        }
        function stop() {
            animation.started = false
            clearInterval(self.timer)
            clearTimeout(self.timerTimeout)
            self.blockOrUnblockControls(false)
            workElem.attr("d", line([{x: 0, y: 0}, {x: 0, y: 0}]))
            animationCircle.attr("cx", -100).attr("cy", -100)

            self.dragHandler(svg.select("#circle1"));
            self.dragHandler(svg.select("#circle2"));
            animation.pauseIndex = 1
            animation.points = []
            animation.values = []
            data.V = 0
            data.p = 0
            self.updateParams()
            self.updateVpTlabels(data.V1, data.p1, data.T1)
            self.updateEnergyLabels()
        }
        function next() {
            if (animation.started) {
                clearInterval(self.timer)
                clearTimeout(self.timerTimeout)
                data.V = animation.values[animation.values.length-1].V
                data.p = animation.values[animation.values.length-1].p
                var y0 = fence.y0
                var points = [{x: scaleX(data.V2)+margin, y: y0},
                    {x: scaleX(data.V1)+margin, y: y0},
                    {x: scaleX(data.V1)+margin, y: scaleY(data.p1)+margin},
                    ...animation.points]
                workElem.attr("d", line(points))
                self.updateParams()
                self.updateVpTlabels(data.V, data.p, data.T)
                self.updateEnergyLabels()
                animationCircle.attr("cx", -100).attr("cy", -100)
            } 
            
        }
    }
});