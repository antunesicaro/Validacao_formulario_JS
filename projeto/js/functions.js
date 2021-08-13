class ValidaFormulario{
  constructor(){
    this.formulario = document.querySelector('.formulario'); //seleciona pela classe formulario
    this.eventos()//já chama o método eventos que foi criado
  }

  //cria o método eventos
  eventos(){ //onde começam os eventos
    //adiciona um envento à classe formulario
    this.formulario.addEventListener('submit',(e) => { //captura o evento de submit, ao clicar no submit vai executar uma função... passa uma função arrow pra que o this não seja perdido 
      this.handleSubmit(e); //passa o evento de submit para o método handleSubmit, que irá ser um método que recebe como parametro o evento de submit, ai lá nele podemos fazer ações com o evento
    });
  }

  handleSubmit(e){ //recebe o evento como parametro do método eventos
    e.preventDefault(); // previne o padrão que  é enviar o formulário... não queremos enviar, pois ainda temos que checar se está tudo de acordo, valida-lo
    //console.log('nao enviou o form quando cliquei no enviar'); //mostra que previniu enviar o form, nao foi enviado pois cancelamos o envio com prevent default
  
   const camposValidos = this.camposSaoValidos();//nesse método, vai retornar se o campo é vlálido ou não, vai fazer a cecagem lá
   const senhasValidas = this.senhasSaoValidas();//esse método vai nos dizer se as senhas sao iguais(válidas) 
   
    if(camposValidos && senhasValidas){//se retornar true das flags
      alert('form enviado');
      this.formulario.submit(); //quando tudo estiver, envia esse formulario
    }

  }


  senhasSaoValidas(){
    let valid = true;//flag começa sendo true, se passar pelas checagens e der errado a validação, a flag vai ser mudada pra false, o q irá retornar false e não estará validada a senha
    
    //pegando os elementos selecionados e checando-os
    const senhaClasse = this.formulario.querySelector('.senha');
    const repetirSenhaClasse = this.formulario.querySelector('.repetir-senha')
    
    if(senhaClasse.value !== repetirSenhaClasse.value){//checagem para ver se estão igual
      this.criaErro(senha, 'Senhas não estão iguais'); //manda o capo senha e a mesngagem tb pro método criarErro como parametro, lá ele vai receber e disparar um erro
      valid = false; //torna a flag false pois deu errado a validação, ou seja, formualrio nao vai ser enviado
    }

    //checagem pro tamanho da senha
    if(senhaClasse.value.length < 6 || senhaClasse.value.length > 12){
      this.criaErro(senha,'Senha não pode ser menor que 6 nem maior que 12 caracteres');

      valid = false; //torna a flag false pra não enviar o formulario
    }


    
    return valid; //todas checagens foram feitas e o usuário completou a senha de maneira correta
  }

  camposSaoValidos(){
    let valid = true;//normalmente é true, mas nas checagens, se algo der errado vamos mudar pra false... no final esse valid vai ter uma checagem tb... se valid = true, envia formulario, se valid for false, nao envia formulario.
    
    const camposClasseValidar = this.formulario.querySelectorAll('.validar');//seleciona todos os campos que possuem a classe validar no html
    const errosDisparados = this.formulario.querySelectorAll('.error-text');//marca as mensagens de erro que aparecem

    for(let erro of errosDisparados){//varre todos erros que apareceram
      erro.remove(); //remove o erro pra nãa repetir, caso o mesmo erro persistar ele vai ser enviado novamente, mas o anterior será removido
    }


    for(let campo of camposClasseValidar){//faz um for pra varrer campo a campo de camposClasseValidar, que é onde esão todos campos
      
    //selecionando no html, o irmão anterior do input, que no caso é o label... se o input for o input de nome, o label que está anterior à ele é o label Nome... e assim por diante... dai podemos pegar o nome e botar na mensagem' tal campo nao pode estar vazio'
    const textLabel = campo.previousElementSibling.innerHTML; //pega o irmão anterior q é o previous e pega o innerHTML dele que é 'Nome'
      
      //pra todos os campos,não podem estar vazios
      if(!campo.value){ //se o campo estiver vazio(não for preenchido)
        this.criaErro(campo,`Campo "${textLabel}" não pode estar vazio`) //cria método para se estiver vazio, um erro será apresentado
        valid = false;//campo não é válido pois está vazio
      }
      //pro cpf, tem que ser validado
      if(campo.classList.contains('cpf')){//se no campo existir(conter) a classe cpf
        if(!this.validaCPF(campo)) valid = false; //se o método validaCPF, que deve retornar true, retornar false, torna o valid(que é a flag pra dizer se está valido ou invalido o dado) pra false... campo vai como argumento para o método validaCPF
      }

      //pro usuário, tem que estar entre 3 e 12 caracteres e só pode ter letras e números
      if(campo.classList.contains('usuario')){
        if(!this.validaUsuario(campo)) valid = false; //se for diferente do método validaUsuario(), ou seja, se não for retornado true no método, é pq é false a a validação deve ser falsa
      }
    }

    return valid; //retorna o true ,se passar por todas checagens, vai retornar true e dizer que o formulário vai ser enviado
  }

  validaUsuario(campo){
    const usuarioDigitado = campo.value; //pega o valor do campo com a classe usuario, que no caso é o usuário que foi digitado
    let valid = true;//cria uma flag pra caso dê errado a checagem, o processo de checagem não encerre no primeiro erro, uma vez que podem haver novos erros e queremos que esses novos erros sejam disparados e mostrados tb, por isso  o processo de checagem precisa continuar
    
   
       //se o tamanho de caracteres do usuário for menor que 3 ou maior que 12, retorna false, cancela a ação de validação de nome de usuário
       if(usuarioDigitado.length < 3 || usuarioDigitado.length > 12) {
        this.criaErro(campo, 'Usuário precisa ter entre 3 e 12 caracteres.');
        valid = false;// valid é false, logo a não vai ser retornado true pra confirmar que está validado o usuário
      }
  
    
    //expressão regular pra dizer que o usuário precisa conter somento numeros e letras
    if(!usuarioDigitado.match(/^[a-zA-Z0-9]+$/g)){
      this.criaErro(campo,'Nome de usuário precisa conter apenas números e/ou letras')
      valid = false;
    }
    
    return valid;//se passar pela validação, vai chegar no true, no caso a flag é true
  }

  validaCPF(campo){
    const cpf = new ValidaCPF(campo.value); //o que é recebido aqui em campo.value é o valor digitado no input, quando enviado ele é mandado para a classe ValidaCPF, e lá todos os métodos de validação de cpf são executados
    if(!cpf.valida()){//se for diferente de cpf.valida, ou seja, se retornar false, isto é, retornar que o cpf é inválido, executa o método de erro
      this.criaErro(campo,'CPF invalido')
      return false; //retorna false
    }

    return true; //cpf válido retorna true
  }

  criaErro(campo,mensagem){
    const divErro = document.createElement('div');//cria uma div nova para colocar a mensagem de erro
    divErro.innerHTML = mensagem; //adiciona como texto a mensagem q vai vir do erro
    divErro.classList.add('error-text');//adiciona uma classe... é importante criar essa error-text de classe para que depois possamos estilizar todos erros de uma vez
    campo.insertAdjacentElement('afterend',divErro);//adiciona depois que terminar o campo, a divErro, que contém uma mensagem de erro com a classe error-text
  

  }



}

const valida = new ValidaFormulario(); //executa o valida formulario, ai quando executar ele já vai de cara chamar o this.eventos, ai vai começar os eventos de validação