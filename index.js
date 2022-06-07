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
        this._jsonData;     // JSON
        this._keyNum;
        this.convert(this._input);
    }

    get keyNum(){
        return this._keyNum;
    }

    set keyNum(val){
        this._keyNum = val;
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
        let _KEY = inputArr.shift().split('\t');

        // [예외처리]
        // 1) \t 만 있는 경우
        // 2) 중간에 빈 문자열이 포함되어있는 경우
        const KEY = _KEY.filter((item) => item !== '' );
        this.keyNum = KEY.length;
        if(this.keyNum === 0){
            $jsonData.val('');
            return false;
        }
        
        let data = [];
        
        for(let val of inputArr){
            const valArr = val.trim().split('\t').filter((item) => item !== '');
            
            if(valArr.length > 0){
                const obj = this.getObj(KEY, valArr);
                data.push(obj);
            }
        }

        this.showJson(data);
        this.jsonData = data;
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

    getObj(keyArr, valArr){
        const obj = new Object();
        let value = '';

        for(let idx in keyArr){
            // 예외처리
            // 3) key값보다 value가 적은 경우
            if(valArr[idx] === undefined){
                value = 'null';
            }else{
                value = valArr[idx];
            }

            obj[keyArr[idx]] = value;
        }

        return obj;
    }
}


// function changeProperty(){
//     console.log($excelData);
//     $excelData.attr('background-color', 'red');
// }


class MyChart{
    constructor(wrap, info){
        this._html = `<canvas id="myChart"></canvas>`;
        this._htmlId = '#myChart';
        this._wrap = wrap;
        this._info = info;
        this._labels;
        this._datasets = {
            label: 'My First dataset',
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: [0, 10, 5, 2, 20, 30, 45],
        }
        this._data = {
            labels: 'none',
            datasets: []
        };

        this.getInfoData();
    }

    get htmlId(){
        return this._htmlId;
    }

    get html(){
        return this._html;
    }

    get labels(){
        return this._labels;   
    }

    set labels(val){
        this._labels = val;
        this._data.labels = val;
    }

    get datasets(){
        return this._datasets;
    }

    set datasets(val){
        this._datasets.data = val;
        this._data.datasets.push(this.datasets);
    }

    get info(){
        return this._info;
    }

    get wrap(){
        return this._wrap;
    }

    get data(){
        return this._data;
    }

    getInfoData(){
        const INFO = this.info;

        let labelList = [];
        let dataList = [];
        for(let idx in INFO){
            const obj = INFO[idx];
            Object.entries(obj).forEach(([key, val], idx)=>{
                if(idx === 0){
                    labelList.push(val);
                }else if(idx === 1){
                    dataList.push(val);
                }
            })
        }

        dataList = dataList.map((item) => Number(item));
        for(let item of dataList){
            if(isNaN(item)){
                alert('두번재 컬럼값이 숫자인 경우에만 가능합니다.');
                return false;
            }
        }

        this.labels = labelList;
        this.datasets = dataList;

        const config = {
            type: 'line',
            data: this.data,
            options: {}
        };

        this.wrap.html(this.html);

        const myChart = new Chart(
            $(`${this.htmlId}`),
            config
        );
    }
}


// $(document).ready(function(){ });와 동일
// => $(function(){})
$(function () {
    let converter = '';
    // input 실시간 감지
    // propertychange change keyup paste 
    // input 이벤트: input의 value 값이 바뀔 때마다 발생한다.
    $excelData.on('input', (e) => {
        const $target = $excelData;
        const excelStr = $target.val().trim();
        converter = new Converter(excelStr);
    })

    $btnConvertChart.on('click', (e)=>{
        const colNum = converter.keyNum;
        if(colNum !== 2){
            alert('컬럼이 2개인 경우만 사용가능합니다.');
            return false;
        }

        const info = converter.jsonData;
        if(info === undefined || info.length === 0){
            alert('데이터가 없습니다.');
            return false;
        }

        const myChart = new MyChart($('#myChartWrap'), info);
        // changeProperty();
    })
});
