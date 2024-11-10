const fs = require('fs');
const cors = require('cors');
const express = require('express')
const bodyParser = require("body-parser");
const path = require('path');
const { Console } = require('console');
const app = express();
const port = process.env.port || 3001;

app.use(cors());
app.use(express.static(path.join(__dirname, 'lunch/build')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const filePath = path.join(__dirname, 'lunch/data', 'menu.json');
const fileData = fs.readFileSync(filePath);
const menus = JSON.parse(fileData);

app.get('/', (req, res) => {    
    req.sendFile(path.join(__dirname, '/build/index.html'));
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

app.post("/getLike", (req, res) => { // 데이터 받아서 결과 전송

    const Date = req.body.Date;
    const Value = req.body.Value;
    const sendData = { like: "" };

    if(menus.hasOwnProperty(Date)){
        menus[Date] = menus[Date] + Value;
    }
    else{
        menus[Date] = 0 + Value;
        console.log(Date + " : " + Value);
    }

    console.log(JSON.stringify(menus));
    fs.writeFileSync(filePath, JSON.stringify(menus));

    sendData.like = menus[Date];
    res.send(sendData);
});