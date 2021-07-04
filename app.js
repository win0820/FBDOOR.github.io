var all_data = "";
get_all_id();
var t1 = window.setInterval("time_allup()", 5000);
var t2 = window.setInterval("fast_up_time()", 100);
var door_name = ["城市B區", "明德大門", "城市A區", "建國大門"];
var up_new_time = ["", "", "", "", ""];
function startTime() {
  var today = new Date();
  var hh = today.getHours();
  var mm = today.getMinutes();
  var ss = today.getSeconds();
  mm = checkTime(mm);
  ss = checkTime(ss);
  document.getElementById("clock").innerHTML = hh + ":" + mm + ":" + ss;
  var timeoutId = setTimeout(startTime, 500);
}
function checkTime(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}
function time_allup() {
  updata_time(1);
  updata_time(2);
  updata_time(3);
  updata_time(4);
}
function updata_time(num) {
  $.getJSON(
    "https://dady-door.firebaseio.com/time" + String(num) + ".json"
  ).then((val) => {
    document.getElementById("door" + String(num) + "_id").innerHTML = "";
    up_new_time[num - 1] = val["T"];
  });
}
function fast_up_time() {
  for (let j = 0; j < 4; j++) {
    if (up_new_time[j].length > 3) {
      var y = "",
        m = "",
        d = "",
        h = "",
        mm = "",
        s = "";
      var n = 0;
      for (let i = 0; i < +up_new_time[j].length; i++) {
        if (
          up_new_time[j][i] == "-" ||
          up_new_time[j][i] == " " ||
          up_new_time[j][i] == ":"
        ) {
          n += 1;
        } else {
          if (n == 0) y += up_new_time[j][i];
          if (n == 1) m += up_new_time[j][i];
          if (n == 2) d += up_new_time[j][i];
          if (n == 3) h += up_new_time[j][i];
          if (n == 4) mm += up_new_time[j][i];
          if (n == 5) s += up_new_time[j][i];
        }
      }
      var dt = new Date();
      var newtime = dt.getTime()
      var time = new Date(
        y + "/" + m + "/" + d + " " + h + ":" + mm + ":" + s
      ).getTime();
      dt = Math.round((newtime - time) / 1000);
      document.getElementById("door" + String(j + 1)).innerHTML =
        door_name[j] + "_______" + "更新時間:";
      s = "";
      if (dt >= 60 * 60 * 24)
        s += String(Math.floor(dt / (60 * 60 * 24))) + "日 ";
      if (dt >= 60 * 60)
        s += String(Math.floor((dt % (60 * 60 * 24)) / (60 * 60))) + "時 ";
      if (dt >= 60) s += String(Math.floor((dt % (60 * 60)) / 60)) + "分 ";
      s += String(dt % 60) + "秒 ";
      document.getElementById("door" + String(j + 1)).innerHTML +=
        "________" + String(s) + " 前";
    }
  }
}
function door_chager(num) {
  var s =
    document.getElementById("door" + String(num)).innerHTML +
    document.getElementById("door" + String(num) + "_id").innerHTML;
  //console.log(s.indexOf("|"))
  var ss = "";
  for (let i = s.indexOf("|") + 2; i < s.length; i++) ss += s[i];
  ss = ss.split(",");
  document.getElementById("del1").value = ss[0];
  document.getElementById("del2").value = ss[1];
  document.getElementById("del3").value = ss[2];
  document.getElementById("del4").value = ss[3];
}
function open_door(num) {
  $.ajax({
    url: "https://dady-door.firebaseio.com/door" + String(num) + "_start.json",
    method: "PUT",
    contentType: "application/json",
    data: JSON.stringify({
      st: "1",
    }),
  })
    .done(function (data, textStatus, jqXHR) {
      console.log("success");
      alert("上傳成功");
      console.log(data);
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      console.log(errorThrown);
      alert("上傳失敗");
    })
    .always(function () {
      console.log("finished");
    });
}
function get_all_id() {
  $.getJSON("https://dady-door.firebaseio.com/all_id/all_data.json").then(
    (val) => {
      all_data = val;
      updata_desk();
    }
  );
  updata_time(1);
  updata_time(2);
  updata_time(3);
  updata_time(4);
}

function del_id() {
  var s = "";
  s += document.getElementById("del1").value + ",";
  s += document.getElementById("del2").value + ",";
  s += document.getElementById("del3").value + ",";
  s += document.getElementById("del4").value;
  del(s);
}

function del(s) {
  $.getJSON("https://dady-door.firebaseio.com/all_id/all_data.json").then(
    (val) => {
      all_data = val;
      if (all_data.indexOf(s) != -1) {
        let i = all_data.indexOf(s);
        for (s = ""; all_data[i] != "&"; i++) {
          s += all_data[i];
        }
        s += "&";
        all_data = all_data.replace(s, "");
        updata_cloud();
        updata_desk();
        alert("已刪除");
      } else {
        alert("無此ID");
      }
    }
  );
}
function add_id() {
  $.getJSON("https://dady-door.firebaseio.com/all_id/all_data.json").then(
    (val) => {
      all_data = val;
      var s = "",
        id = "";
      s += document.getElementById("del1").value + ",";
      id += document.getElementById("del1").value + ",";
      s += document.getElementById("del2").value + ",";
      id += document.getElementById("del2").value + ",";
      s += document.getElementById("del3").value + ",";
      id += document.getElementById("del3").value + ",";
      s += document.getElementById("del4").value + "%";
      id += document.getElementById("del4").value;
      s += document.getElementById("name_input").value + "%$";
      s += document.getElementById("ps_input").value + "$&";
      if (all_data.search(id) != -1) {
        alert("覆蓋");
        let j = all_data.search(id);
        id = "";
        for (let i = j; all_data[i] != "&"; i++) id += all_data[i];
        all_data = all_data.replace(id + "&", "");
      }
      all_data = s + all_data;
      updata_cloud();
      updata_desk();
      alert("已加入");
      document.getElementById("del1").value = "";
      document.getElementById("del2").value = "";
      document.getElementById("del3").value = "";
      document.getElementById("del4").value = "";
      document.getElementById("name_input").value = "";
      document.getElementById("ps_input").value = "";
    }
  );
}
function updata_desk() {
  var num = 0;
  var id = "";
  var car_id = "";
  var name = "";
  var pss = "";
  var tas = "<tr><td>";
  for (let i = 0; i < all_data.length; i++) {
    id += all_data[i];
    if (all_data[i] == "&") {
      for (let j = 0; j < id.length; j++) {
        if (id[j] == "%") {
          j++;
          while (id[j] != "%") {
            name += id[j];
            j++;
          }
        }
      }
      for (let j = 0; j < id.length; j++) {
        if (id[j] == "$") {
          j++;
          while (id[j] != "$") {
            pss += id[j];
            j++;
          }
        }
      }
      for (let j = 0; j < id.length; j++) {
        if (id[j] == "%" || id[j] == "&" || id[j] == "$") j = id.length;
        else car_id += id[j];
      }
      tas += car_id;
      tas += "</td><td>" + name + "</td><td>" + pss + "</td><td>";
      //tas+=("<input type="+ '"'+"button"+'"'+" "+"onClick="+'"'+"del('"+id+"')"+'"'+"value="+ '"'+"刪除卡片"+'"'+">");
      tas +=
        "<input type=" +
        '"' +
        "button" +
        '"' +
        " " +
        "onClick=" +
        '"' +
        "cpl('" +
        id +
        "')" +
        '"' +
        "value=" +
        '"' +
        "編輯" +
        '"' +
        ">";
      tas += "</td></tr><tr><td>";
      num = 0;
      id = "";
      car_id = "";
      name = "";
      pss = "";
    }
  }
  $("#tbody1").html(tas);
}

function cpl(id) {
  var k = 0,
    a = ["", "", "", "", "", "", "", "", "", "", "", ""];
  for (j = 0; j < id.length; j++)
    if (id[j] == "%" || id[j] == "$" || id[j] == "&" || id[j] == ",") k++;
    else a[k] += id[j];
  document.getElementById("del1").value = a[0];
  document.getElementById("del2").value = a[1];
  document.getElementById("del3").value = a[2];
  document.getElementById("del4").value = a[3];
  document.getElementById("name_input").value = a[4];
  document.getElementById("ps_input").value = a[6];
}
function updata_cloud() {
  $.ajax({
    url: "https://dady-door.firebaseio.com/all_id.json",
    method: "PUT",
    contentType: "application/json",
    data: JSON.stringify({
      all_data,
    }),
  })
    .done(function (data, textStatus, jqXHR) {
      console.log("success");
      alert("上傳成功");
      console.log(data);
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      console.log(errorThrown);
      alert("上傳失敗");
    })
    .always(function () {
      console.log("finished");
    });
}
