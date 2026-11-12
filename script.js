(function(){
  var $=function(id){return document.getElementById(id)};
  var root=document.documentElement;
  root.classList.add('lock');

  /* ---------- live device time and date ---------- */
  var timeEl=$('time'),ampmEl=$('ampm'),dateEl=$('date'),lastKey='';
  function tick(){
    var d=new Date(),h=d.getHours(),m=d.getMinutes();
    var key=h+':'+m+':'+d.getDate();
    if(key===lastKey)return;
    lastKey=key;
    timeEl.textContent=(h%12||12)+':'+(m<10?'0':'')+m;
    ampmEl.textContent=h<12?'AM':'PM';
    dateEl.textContent=d.toLocaleDateString('en-US',{weekday:'long'})+', '+d.getDate()+' '+d.toLocaleDateString('en-US',{month:'long'});
  }
  tick();setInterval(tick,1000);

  /* ---------- background song ---------- */
  var song=$('song'),started=false;
  function startSong(){
    if(started)return;
    var p=song.play();
    if(p&&p.then)p.then(function(){started=true}).catch(function(){});
    else started=true;
  }
  startSong();
  ['pointerdown','touchend','click','keydown'].forEach(function(ev){addEventListener(ev,startSong,{passive:true})});
  document.addEventListener('visibilitychange',function(){if(!document.hidden&&started&&song.paused)song.play().catch(function(){})});

  /* ---------- falling hearts ---------- */
  var layer=$('hearts'),heartTimer=null;
  var HEART='<svg class="heart" viewBox="0 0 24 24" width="{s}" height="{s}"><path d="M12 20.5 3.6 12.2A5.1 5.1 0 0 1 11 5.2l1 1 1-1a5.1 5.1 0 0 1 7.4 7Z"/></svg>';
  function spawn(){
    var rem=parseFloat(getComputedStyle(root).fontSize),w=layer.clientWidth,h=layer.clientHeight;
    var size=(1.4+Math.random()*2.6)*rem;
    var wrap=document.createElement('div');
    wrap.innerHTML=HEART.replace(/\{s\}/g,size.toFixed(1));
    var el=wrap.firstChild;
    var x=Math.random()*(w-size),sway=(Math.random()-.5)*5*rem,rot=(Math.random()-.5)*50;
    var dur=3800+Math.random()*3200;
    layer.appendChild(el);
    var a=el.animate([
      {transform:'translate('+x+'px,'+(-size*1.5)+'px) rotate('+(-rot)+'deg)',opacity:.95},
      {transform:'translate('+(x+sway)+'px,'+(h+size)+'px) rotate('+rot+'deg)',opacity:.95}
    ],{duration:dur,easing:'ease-in'});
    a.onfinish=function(){el.remove()};
  }
  function startHearts(){
    for(var i=0;i<5;i++)setTimeout(spawn,i*120);
    heartTimer=setInterval(spawn,230);
  }
  function stopHearts(){clearInterval(heartTimer);heartTimer=null;layer.textContent=''}

  /* ---------- the flow ---------- */
  var s1=$('s1'),s2=$('s2'),s3=$('s3'),s4=$('s4'),step=1;
  function toBear(){
    if(step!==1)return;step=2;
    $('phone').classList.add('leave');
    setTimeout(function(){
      s1.classList.remove('active');s2.classList.add('active');
      $('bearBox').classList.add('show');
      startHearts();
      setTimeout(toCard,4200);
    },420);
  }
  function toCard(){
    if(step!==2)return;step=3;
    stopHearts();
    s2.classList.remove('active');s3.classList.add('active');
  }
  function toGift(){
    if(step!==3)return;step=4;
    s3.classList.add('out');
    setTimeout(function(){
      s3.classList.remove('active');
      s3.hidden=true;s1.hidden=true;s2.hidden=true;
      s4.hidden=false;
      root.classList.remove('lock');
      window.scrollTo(0,0);
      s4.classList.add('enter');
    },950);
  }
  $('notif').addEventListener('click',toBear);
  $('forgive').addEventListener('click',toGift);
})();
