function enviarFicha() {
  const dados = document.getElementById('dados').value;
    if (!dados.trim()) { alert('Cole os dados!'); return; }
      fetch('/api/enviar-ficha', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({dados})})
          .then(r => r.json()).then(d => {
                if(d.sucesso) {
                        document.getElementById('statusBox').style.display='block';
                                document.getElementById('status').textContent = '\u2705 Concluído';
                                        document.getElementById('cpfStatus').textContent = d.cpf;
                                                document.getElementById('nomeStatus').textContent = d.cliente;
                                                        document.getElementById('btnFandi').style.display='inline';
                                                                document.getElementById('btnEmail').style.display='inline';
                                                                        localStorage.setItem('url', d.url);
                                                                              } else alert('Erro: '+d.erro);
                                                                                  }).catch(e => alert('Erro: '+e));
                                                                                  }
                                                                                  function abrirFandi() { window.open(localStorage.getItem('url')); }
                                                                                  function enviarEmail() { alert('Email enviado!'); }
