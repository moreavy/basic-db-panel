const { Server } = require("basic-db");
const { EOL } = require("os");
let database;

var basicMain = `<div class="text-center">
    <br>
    <h4>Create Database Or Fetch An Existing Database</h3>
    <input class="w3-input w3-border w3-round" type="text" id="dbn"/>
    <br>
    <button class="btn w3-green w3-ripple" onclick="start(v$('dbn'))" title="Start Basic-DB Workspace">Start Workspace</button>
</div><br>`

function v$(elementId) {
    return document.getElementById(elementId).value;
}

function tabularify(data) {
    var ks = Object.keys(data);
    var vs = Object.values(data);
    var toSend = "";
    for (var i = 0; i < ks.length; i++) {
        var key = ks[i];
        var value = vs[i];
        toSend = `${toSend}<tr><td>${key}</td><td>${value.toString()}</td></tr>`;
    }
    return toSend;
}

function start(dbname) {
    if (/^\s+$/.test(dbname) || dbname.length <= 0) return alert("Inavlid Database Name!");
    if (/[^a-zA-Z]/.test(dbname) || dbname.charAt(0) === " ") return alert("The name of the database should only contain alphabets!");
    database = new Server(dbname);
    document.getElementById("content").innerHTML = `<div class="text-center"><br><h4>Data Inside Database</h4><table>
        <thead><tr><td><b>Key</b></td><td><b>Value</b></td></tr></thead>
        <br><tbody id="fetcher">${tabularify(database.exportAll())}</tbody>
    </table></div><div class="text-center">
        <br>
        <h4>Set or Insert Data:</h4>
        <br>
        <div class="form-group">
            <label>Key:</label>
            <input id="ikey" type="text" class="w3-round w3-border"/>
        </div>
        <div class="form-group">
            <label>Value:</label>
            <input id="ival" type="text" class="w3-round w3-border"/>
        </div>
        <button class="btn w3-green w3-ripple" title='Set or Insert Data Into "${database.name}" Database' onclick="cSet(v$('ikey'), v$('ival'))">Set or Insert</button>
    </div>
    <div class="text-center">
        <h4>Delete Data:</h4>
        <div class="form-group">
            <label>Key:</label>
            <input type="text" id="dkey" class="w3-round w3-border"/>
        </div>
        <button class="btn w3-green w3-round w3-ripple" onclick="cDelete(v$('dkey'))">Delete</button>
    </div><div class="text-center">
        <h4>Export Data</h4>
        <div class="form-group">
            <label style="white-space: normal;">Type: </label>
            <select id="exportdatatype">
                <option value="JSON">JSON</option>
                <option value="CSV">CSV</option>
                <option value="CONF">CONF</option>
            </select>
        </div>
        <button class="btn w3-green w3-round w3-ripple" title="Export Data From Database Into A File" onclick="sExport(v$('exportdatatype'))">Export</button>
    </div>`;
    document.getElementById("footer").innerHTML = `
    <br>
    <label>Return Home To Switch Database: </lable><button class="btn w3-green w3-ripple w3-round" onclick="reload()">Return Home</button>
    <br><br>`
    document.title = `Basic-DB Workspace | @${database.name}`;
}

function cSet(key, value) {
    if (/^\s+$/.test(key) || key.length <= 0) return alert("Inavlid Key!");
    if (/[^a-zA-Z]/.test(key) || key.charAt(0) === " ") return alert("The key should only contain alphabets!");
    database.set(key, value);
    document.getElementById("fetcher").innerHTML = tabularify(database.exportAll());
}

function cDelete(key, value) {
    var keys = Object.keys(database.exportAll());
    if (!keys.includes(key)) return alert("Can't find the given key in the database.");
    database.delete(key, value);
    document.getElementById("fetcher").innerHTML = tabularify(database.exportAll());
}

function sExport(type) {
    if (type === "JSON") {
        download(`${JSON.stringify(database.exportAll())}${EOL}`, `${database.name}.json`, "text/json");
    } else if (type === "CSV") {
        var keys = Object.keys(database.exportAll());
        var vals = Object.values(database.exportAll());
        var mixer = [];
        var tree = "";

        for (var i = 0; i < keys.length; i++) {
            var k = keys[i];
            var v = vals[i];
            mixer.push({
                key: k,
                value: v,
            });
        }

        for (var i = 0; i < mixer.length; i++) {
            if (i === 0) {
                tree = `${mixer[i].key},${mixer[i].value}`;
            } else {
                tree = `${tree}\n${mixer[i].key},${mixer[i].value}`;
            }
        }

        download(`${tree}${EOL}`, `${database.name}.csv`, "text/csv");
    } else if (type === "CONF") {
        var keys = Object.keys(database.exportAll());
        var vals = Object.values(database.exportAll());
        var tree = "";

        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var value = vals[i]
            if (i === 0) {
                tree = `${key} = ${value}`;
            } else {
                tree = `${tree}\n${key} = ${value}`;
            }
        }

        download(`${tree}${EOL}`, `${database.name}.conf`, "properties/conf");
    }
}

function reload() {
    document.getElementById("content").innerHTML = basicMain;
    document.getElementById("footer").innerHTML = "";
}
window.addEventListener("load", reload);
