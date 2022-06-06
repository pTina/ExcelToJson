// 클론 프로젝트
// https://shancarter.github.io/mr-data-converter/

// 부트스트랩 사용하여 반응형 웹사이트 제작
// https://getbootstrap.kr/docs/5.1/utilities/background/

// 더미데이서 생성 사이트
// https://generatedata.com/generator

const $excelData = $('#excelData');
const $jsonData = $('#jsonData');
const $btnConvertChart = $('#btnConvertChart');

class Converter{
    constructor(inputStr){
        this._input = inputStr;
        this._excelData;    // array
        this._jsonData;     // string

        this.convert(this._input);
    }

    get excelData(){
        return this._excelData;
    }

    set excelData(val){
        this._excelData = val;
    }

    get jsonData(){
        return this._jsonData;
    }

    set jsonData(val){
        this._jsonData = val;
    }

    convert(inputStr) {
        const _input = inputStr;
        const inputArr = _input.split('\n');
        let testStr = inputArr.shift();
        testStr = this.addTab(testStr);
        const KEY = testStr.split('\t');
        const col = KEY.length;
        let data = [];
        
        for(let val of inputArr){
            let testStr = val.trim();
            testStr = this.addTab(testStr);
            const _val = testStr.split('\t');
            const obj = new Object();
            for(let idx in KEY){
                obj[KEY[idx]] = _val[idx];
            }

            data.push(obj);
        }

        this.showJson(data);
    }

    showJson(json){
        let myJson = '[{{data}}]';
        let data = '';
        for(let val of json){
            const _myJson = JSON.stringify(val);
            const str1 = _myJson.split(':').join(': ');
            const str2 = str1.split(',"').join(', "');
            

            data += `${str2}, \n`;
        }

        $jsonData.val(myJson.replace('{{data}}', data.slice(0, data.length-3)));

        // let str = '';
        // str = JSON.stringify(json);
        // str = str.split('},').join('}, \n');
        // $jsonData.val(str);
        
    }

    addTab(str){
        if(str.indexOf('\t') > -1){
            return str;

        }else{
            str = str.concat('\t null');
            return str;
        }

    }
}

// const labels = [
//     'January',
//     'February',
//     'March',
//     'April',
//     'May',
//     'June',
// ];

// const data = {
//     labels: labels,
//     datasets: [{
//         label: 'My First dataset',
//         backgroundColor: 'rgb(255, 99, 132)',
//         borderColor: 'rgb(255, 99, 132)',
//         data: [0, 10, 5, 2, 20, 30, 45],
//     }]
// };

// const config = {
//     type: 'line',
//     data: data,
//     options: {}
// };

// class ChartData{
//     constructor(dataArr){
//         this._data = dataArr;
//         this.fisrtItem = JSON.parse(this.data[0]);
//         this._labels;
//         this._datasets;
//         this._config;
//         this._key;
//         // this.getLabels();
//         this.getKey();
//     }

//     get data(){
//         return this._data;
//     }

//     set key(val){
//        this._key = val; 
//     }

//     getKey(){
//         console.log(Object.keys(this.fisrtItem));
//     }
//     getLabels(){
//         for(let data of this._data){
//             console.log(JSON.parse(data));
//         }
//     }

// }


// $(document).ready(function(){ });와 동일
// => $(function(){})
$(function () {
    // input 실시간 감지
    $excelData.on('propertychange change keyup paste', (e) => {
        const $target = $excelData;
        const excelStr = $target.val().trim();
        const converter = new Converter(excelStr);
    })

    $btnConvertChart.on('click', (e)=>{
        // changeProperty();
    })

    // $btnConvertChart.on('click', function(){
    //     const dataArr = converter.excelData;
    //     const chartData = new ChartData(dataArr);
    // })

    

    // makeChart();
    
});

// function changeProperty(){
//     console.log($excelData);
//     $excelData.attr('background-color', 'red');
// }



function makeChart(config) {
    const myChart = new Chart(
        $('#myChart'),
        config
      );
}