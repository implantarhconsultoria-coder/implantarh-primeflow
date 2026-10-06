(()=>{
  const OWNER_HASH='f8c07db29440114e8468dc9d1b623e2fd1b0137272d16ccd19ef1267f573bed1';
  const REPORT_PREFIX='#report=';

  const style=document.createElement('style');
  style.textContent=`
    .brand-mark{width:46px;height:46px;border-radius:14px;display:grid;place-items:center;flex:0 0 46px;font-size:12px;font-weight:800;letter-spacing:-.4px;color:#fff;background:linear-gradient(135deg,#2f9bff 0%,#6a5cff 52%,#e14dff 100%);box-shadow:0 0 22px rgba(106,92,255,.35),inset 0 1px 0 rgba(255,255,255,.28)}
    .diag-brand .brand-mark{width:42px;height:42px;flex-basis:42px;border-radius:12px;font-size:11px}
    .owner-view{display:none;min-height:100vh;background:radial-gradient(860px 420px at 76% -10%,rgba(121,70,255,.24),transparent 64%),radial-gradient(760px 380px at 0 100%,rgba(47,155,255,.16),transparent 64%),#050816;padding:24px}.owner-view.active{display:block}
    .owner-shell{width:min(1180px,100%);margin:0 auto}.owner-login{width:min(560px,100%);margin:5vh auto 0;border:1px solid rgba(130,170,255,.33);border-radius:24px;padding:30px;background:linear-gradient(180deg,rgba(10,19,46,.96),rgba(6,12,30,.98));box-shadow:0 24px 70px rgba(0,0,0,.44),0 0 50px rgba(100,70,255,.12)}
    .owner-login h1{font-size:38px;line-height:1.04;margin:10px 0 12px}.owner-login p{color:#b7c4de;line-height:1.55}.owner-report{display:none}.owner-report.active{display:block}
    .report-top{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:12px;padding:16px 18px;border:1px solid rgba(140,170,255,.23);border-radius:18px;background:rgba(7,13,31,.88)}
    .report-grid{display:grid;grid-template-columns:minmax(0,1fr) 340px;gap:12px}.report-card{border:1px solid rgba(140,170,255,.23);border-radius:18px;background:linear-gradient(180deg,rgba(8,16,40,.94),rgba(6,12,30,.96));padding:22px}.report-card h2{margin:0 0 14px;font-size:24px}.report-section{border-top:1px solid rgba(140,170,255,.13);padding:14px 0}.report-section:first-of-type{border-top:0;padding-top:0}.report-kv{display:grid;grid-template-columns:220px 1fr;gap:7px 14px;font-size:13px}.report-kv span{color:#8fa0c2}.report-kv b{font-weight:600}.price-box{position:sticky;top:16px;border:1px solid rgba(132,121,255,.48);border-radius:18px;padding:20px;background:linear-gradient(180deg,rgba(16,24,55,.98),rgba(8,13,32,.98));box-shadow:0 0 40px rgba(106,92,255,.12)}.price-box small{display:block;color:#9eadca;font-size:10px;letter-spacing:1.3px}.price-main{font-size:34px;font-weight:800;margin:7px 0 3px}.price-range{font-size:12px;color:#b8c5df;margin-bottom:14px}.factor{display:flex;justify-content:space-between;gap:10px;padding:8px 0;border-top:1px solid rgba(140,170,255,.12);font-size:12px}.factor span{color:#9eacca}.factor b{text-align:right}.private-badge{display:inline-block;border:1px solid rgba(52,211,153,.25);background:rgba(16,185,129,.08);color:#8ef0ca;border-radius:999px;padding:7px 10px;font-size:11px}.client-done{text-align:center;max-width:720px;margin:7vh auto 0}.client-done .done-icon{width:66px;height:66px;margin:0 auto 18px;border-radius:50%;display:grid;place-items:center;font-size:28px;background:linear-gradient(135deg,rgba(47,155,255,.22),rgba(225,77,255,.25));border:1px solid rgba(140,170,255,.35);box-shadow:0 0 32px rgba(106,92,255,.18)}.client-done h1{font-size:42px}.client-done p{color:#b7c4de;line-height:1.65}.client-note{margin:18px auto;padding:14px;border:1px solid rgba(140,170,255,.18);border-radius:14px;background:rgba(8,14,32,.42);font-size:12px;color:#9eacca;max-width:560px}.owner-error{color:#fda4af;font-size:12px;min-height:18px;margin-top:8px}
    @media(max-width:860px){.owner-view{padding:10px}.owner-login{margin:2vh auto 0;padding:20px;border-radius:18px}.owner-login h1{font-size:30px}.report-grid{grid-template-columns:1fr}.price-box{position:static}.report-kv{grid-template-columns:1fr}.report-kv span{margin-top:5px}.report-top{align-items:flex-start}.client-done{margin-top:3vh}.client-done h1{font-size:30px}}
  `;
  document.head.appendChild(style);

  function addLogoFallbacks(){
    document.querySelectorAll('.shared-logo').forEach(img=>{
      if(img.dataset.fallbackDone)return;
      img.dataset.fallbackDone='1';
      img.alt='';
      const mark=document.createElement('div');
      mark.className='brand-mark';
      mark.textContent='IRH';
      img.parentNode.insertBefore(mark,img);
      const sync=()=>{if(img.src&&img.complete&&img.naturalWidth>0){mark.style.display='none';img.style.display='block'}else{img.style.display='none';mark.style.display='grid'}};
      img.addEventListener('load',sync);img.addEventListener('error',sync);setTimeout(sync,1200);
    });
  }

  function encodeReport(data){
    const json=JSON.stringify(data);
    const b64=btoa(unescape(encodeURIComponent(json))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
    return b64;
  }
  function decodeReport(payload){
    try{let b64=payload.replace(/-/g,'+').replace(/_/g,'/');while(b64.length%4)b64+='=';return JSON.parse(decodeURIComponent(escape(atob(b64))))}catch(e){return null}
  }
  function money(v){return new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL',maximumFractionDigits:0}).format(v)}
  function round100(v){return Math.round(v/100)*100}
  function num(v){return Number(String(v||'').replace(/\D/g,''))||0}

  function pricing(d){
    const empresas=Math.max(1,num(d.empresas)),filiais=num(d.filiais),func=num(d.funcionarios);
    let total=5900;
    const factors=[['Base técnica do projeto',5900]];
    if(empresas>1){const v=Math.min(empresas-1,30)*350;total+=v;factors.push([`${empresas-1} CNPJ(s) adicional(is)`,v])}
    if(filiais>0){const v=Math.min(filiais,30)*180;total+=v;factors.push([`${filiais} filial(is)`,v])}
    let fv=0;
    if(func>1000)fv=9500+(func-1000)*4;else if(func>600)fv=7000;else if(func>300)fv=4500;else if(func>150)fv=2500;else if(func>50)fv=1200;
    if(fv){total+=fv;factors.push([`Volume de ${func} funcionários`,fv])}
    const folha=(d.folha||[]).length*320;if(folha){total+=folha;factors.push([`${(d.folha||[]).length} complexidades de folha`,folha])}
    const hist=(d.historico||[]).length*280;if(hist){total+=hist;factors.push([`${(d.historico||[]).length} blocos de histórico`,hist])}
    const risks=[];
    if(d.esocial==='Possui pendências'){total+=1200;risks.push(['Pendências no eSocial',1200])}
    if(d.eventos==='Sim'){total+=1200;risks.push(['Eventos pendentes no eSocial',1200])}
    if(d.backup!=='Sim'){total+=800;risks.push(['Backup ainda não garantido',800])}
    if(d.dadosDominio==='Sim'){total+=1000;risks.push(['Conciliação com dados já existentes no Domínio',1000])}
    if(d.matriculas==='Sim'){total+=600;risks.push(['Preservação de matrículas',600])}
    if(d.suporte==='Não'){total+=500;risks.push(['Sem acompanhamento atual do suporte Domínio',500])}
    risks.forEach(x=>factors.push(x));
    total=Math.max(6900,round100(total));
    return {recommended:total,minimum:round100(total*.9),ceiling:round100(total*1.15),factors};
  }

  function publicReportData(){
    return {produto:'ImplantaRH PrimeFlow',protocolo:state.protocolo,nome:state.nome,contato:state.contato,empresas:state.empresas,filiais:state.filiais,funcionarios:state.funcionarios,versao:state.versao,instalacao:state.instalacao,dominio:state.dominio,dadosDominio:state.dadosDominio,suporte:state.suporte,esocial:state.esocial,eventos:state.eventos,backup:state.backup,matriculas:state.matriculas,folha:state.folha,historico:state.historico,ultima:state.ultima,desejada:state.desejada,amostra:state.amostra,obs:state.obs,geradoEm:new Date().toISOString()};
  }

  const originalScreenHTML=screenHTML;
  screenHTML=function(){
    if(state.step<5)return originalScreenHTML();
    return `<div class="client-done"><div class="done-icon">✓</div><div class="done-kicker">DIAGNÓSTICO CONCLUÍDO</div><h1>Informações enviadas<br>com sucesso.</h1><p>Seu diagnóstico foi concluído. A partir daqui, a análise técnica e comercial é realizada de forma reservada pela ImplantaRH Consultoria PRO.</p><div class="protocol"><small>PROTOCOLO PRIMEFLOW</small><strong>${esc(state.protocolo)}</strong></div><div class="client-note">O resultado da análise e as informações comerciais não são exibidos nesta área.</div><div class="actions"><button class="btn primary" id="shareReport">ENVIAR DIAGNÓSTICO PARA ANÁLISE →</button></div></div>`;
  };

  const originalBindScreen=bindScreen;
  bindScreen=function(){
    originalBindScreen();
    if(state.step>=5){
      const b=document.getElementById('shareReport');
      if(b)b.onclick=async()=>{
        const payload=encodeReport(publicReportData());
        const link=location.href.split('#')[0]+REPORT_PREFIX+payload;
        const text=`Diagnóstico PrimeFlow concluído\nProtocolo: ${state.protocolo}\nResponsável: ${state.nome}\n\nLink reservado para análise:\n${link}`;
        try{
          if(navigator.share){await navigator.share({title:'Diagnóstico PrimeFlow',text});toast('Diagnóstico pronto para envio.');}
          else{await navigator.clipboard.writeText(text);toast('Link do diagnóstico copiado. Envie ao responsável.');}
        }catch(e){try{await navigator.clipboard.writeText(text);toast('Link do diagnóstico copiado.')}catch(_){}}
      };
    }
  };

  function createOwnerView(){
    const section=document.createElement('section');section.id='ownerView';section.className='owner-view';
    section.innerHTML=`<div class="owner-shell"><div id="ownerLogin" class="owner-login"><div class="eyebrow">IMPLANTARH PRIMEFLOW • ÁREA RESERVADA</div><h1>Relatório técnico e <span class="flow">comercial.</span></h1><p>O resultado completo e os valores de cobrança ficam disponíveis somente neste acesso.</p><label class="fld">Nome do responsável</label><div class="input"><input id="ownerName" autocomplete="name" placeholder="Nome completo"></div><label class="fld">Telefone de acesso</label><div class="input"><input id="ownerPhone" inputmode="tel" maxlength="15" placeholder="(11) 99999-9999"></div><div id="ownerError" class="owner-error"></div><div class="actions"><button class="btn primary" id="ownerEnter">ABRIR RELATÓRIO →</button></div></div><div id="ownerReport" class="owner-report"></div></div>`;
    document.body.insertBefore(section,document.getElementById('toast'));
    const phone=section.querySelector('#ownerPhone');phone.addEventListener('input',e=>e.target.value=maskPhone(e.target.value));
    section.querySelector('#ownerEnter').onclick=()=>ownerLogin();
  }

  async function sha256(text){const data=new TextEncoder().encode(text);const hash=await crypto.subtle.digest('SHA-256',data);return [...new Uint8Array(hash)].map(b=>b.toString(16).padStart(2,'0')).join('')}
  function normName(s){return String(s||'').trim().replace(/\s+/g,' ').toUpperCase()}
  async function ownerLogin(){
    const n=normName(document.getElementById('ownerName').value),p=document.getElementById('ownerPhone').value.replace(/\D/g,'');
    const h=await sha256(`${n}|${p}`);
    if(h!==OWNER_HASH){document.getElementById('ownerError').textContent='Acesso não autorizado.';return}
    const payload=location.hash.slice(REPORT_PREFIX.length);const data=decodeReport(payload);
    if(!data){document.getElementById('ownerError').textContent='Relatório inválido ou incompleto.';return}
    renderOwnerReport(data);
  }

  function row(label,value){return `<span>${esc(label)}</span><b>${esc(value||'—')}</b>`}
  function listText(a){return Array.isArray(a)&&a.length?a.join(' • '):'Nenhum item marcado'}
  function renderOwnerReport(d){
    const p=pricing(d),report=document.getElementById('ownerReport');
    document.getElementById('ownerLogin').style.display='none';report.classList.add('active');
    report.innerHTML=`<div class="report-top"><div><div class="eyebrow">IMPLANTARH PRIMEFLOW</div><h2 style="margin:4px 0 0">${esc(d.nome||'Diagnóstico')}</h2></div><span class="private-badge">● RELATÓRIO RESERVADO</span></div><div class="report-grid"><div class="report-card"><h2>Diagnóstico consolidado</h2><div class="report-section"><div class="report-kv">${row('Protocolo',d.protocolo)}${row('Contato',d.contato)}${row('Empresas / CNPJs',d.empresas)}${row('Filiais',d.filiais)}${row('Funcionários',d.funcionarios)}${row('Versão do Contmatic',d.versao)}${row('Instalação atual',d.instalacao)}</div></div><div class="report-section"><div class="eyebrow" style="margin-bottom:9px">SISTEMAS E SITUAÇÃO</div><div class="report-kv">${row('Domínio',d.dominio)}${row('Dados no Domínio',d.dadosDominio)}${row('Suporte Domínio',d.suporte)}${row('eSocial',d.esocial)}${row('Eventos pendentes',d.eventos)}${row('Backup',d.backup)}${row('Preservar matrículas',d.matriculas)}</div></div><div class="report-section"><div class="eyebrow" style="margin-bottom:9px">COMPLEXIDADE</div><div class="report-kv">${row('Itens de folha',listText(d.folha))}${row('Histórico necessário',listText(d.historico))}</div></div><div class="report-section"><div class="eyebrow" style="margin-bottom:9px">VIRADA</div><div class="report-kv">${row('Última competência',d.ultima)}${row('Competência desejada',d.desejada)}${row('Amostra disponível',d.amostra)}${row('Observações',d.obs||'Sem observações')}</div></div></div><aside class="price-box"><small>VALOR SUGERIDO PARA COBRANÇA</small><div class="price-main">${money(p.recommended)}</div><div class="price-range">Faixa comercial segura: ${money(p.minimum)} a ${money(p.ceiling)}</div><div class="eyebrow" style="margin:14px 0 6px">COMPOSIÇÃO</div>${p.factors.map(f=>`<div class="factor"><span>${esc(f[0])}</span><b>+ ${money(f[1])}</b></div>`).join('')}<div class="factor" style="margin-top:6px"><span>Preço recomendado</span><b>${money(p.recommended)}</b></div><button class="btn primary" id="copyCommercial" style="width:100%;margin-top:14px">COPIAR RESUMO COMERCIAL</button></aside></div>`;
    document.getElementById('copyCommercial').onclick=async()=>{const txt=`PrimeFlow — ${d.nome}\nProtocolo: ${d.protocolo}\nValor sugerido: ${money(p.recommended)}\nFaixa comercial: ${money(p.minimum)} a ${money(p.ceiling)}`;try{await navigator.clipboard.writeText(txt);toast('Resumo comercial copiado.')}catch(e){}};
  }

  function openOwnerIfReport(){
    if(!location.hash.startsWith(REPORT_PREFIX))return;
    document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
    document.getElementById('ownerView').classList.add('active');window.scrollTo(0,0);
  }

  createOwnerView();
  addLogoFallbacks();
  setTimeout(addLogoFallbacks,1400);
  openOwnerIfReport();
  window.addEventListener('hashchange',openOwnerIfReport);
})();
