(function(){
  var burger=document.getElementById('burger'), nav=document.getElementById('nav');
  function setNav(open){nav.classList.toggle('open',open);burger.setAttribute('aria-expanded',open);burger.setAttribute('aria-label',open?'Close menu':'Open menu');}
  burger.addEventListener('click',function(){setNav(!nav.classList.contains('open'));});
  nav.addEventListener('click',function(e){if(e.target.closest('a'))setNav(false);});

  // scroll spy
  var links={};nav.querySelectorAll('a.l').forEach(function(a){links[a.dataset.s]=a;});
  var ids=['about','services','locations','opportunities','contact'];
  function spy(){
    var y=window.scrollY+140,cur='top';
    ids.forEach(function(id){var el=document.getElementById(id);if(el&&el.offsetTop<=y)cur=id;});
    Object.keys(links).forEach(function(k){links[k].classList.toggle('on',k===cur);});
  }
  window.addEventListener('scroll',spy,{passive:true});spy();

  // prefill contact form from buttons
  var role=document.getElementById('f-role'), svc=document.getElementById('f-service');
  document.querySelectorAll('[data-role]').forEach(function(a){a.addEventListener('click',function(){role.value=a.dataset.role;});});
  document.querySelectorAll('[data-service]').forEach(function(a){a.addEventListener('click',function(){
    role.value='Employer';
    for(var i=0;i<svc.options.length;i++){if(svc.options[i].text===a.dataset.service){svc.selectedIndex=i;break;}}
  });});

  // map <-> list highlight
  var rows=document.querySelectorAll('.loc[data-c]');
  rows.forEach(function(r){
    var p=document.getElementById('c-'+r.dataset.c);
    function on(){if(p)p.classList.add('hl');}
    function off(){if(p)p.classList.remove('hl');}
    r.addEventListener('mouseenter',on);r.addEventListener('mouseleave',off);
    r.addEventListener('focus',on);r.addEventListener('blur',off);
  });

  // contact form -> opens the visitor's email app with the message ready
  var form=document.getElementById('cform'), status=document.getElementById('status');
  form.addEventListener('submit',function(e){
    e.preventDefault();
    var d=new FormData(form), name=(d.get('name')||'').trim(), email=(d.get('email')||'').trim();
    if(!name||!email||email.indexOf('@')<1){status.textContent='Please add your name and a valid email so we can reply.';return;}
    var subject='Enquiry from '+name+' ('+d.get('role')+')';
    var body='Name: '+name+'\nEmail: '+email+'\nPhone: '+(d.get('phone')||'-')+'\nI am a: '+d.get('role')+'\nService of interest: '+(d.get('service')||'Not sure yet')+'\n\n'+(d.get('msg')||'');
    var href='mailto:info@teampowerglobal.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
    status.innerHTML='Your email app is opening with the message ready. If nothing opens, <a href="'+href+'">use this link</a> or write to info@teampowerglobal.com.';
    window.location.href=href;
  });
})();
