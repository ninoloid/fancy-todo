const loginUser = (email, password) => {
  return $.ajax({
    method: 'GET',
    url: 'http://localhost:3000/user/login',
    data: {
      email,
      password
    }
  })
}

const registerUser = (email, password) => {
  return $.ajax({
    method: 'POST',
    url: 'http://localhost:3000/user/register',
    data: {
      email,
      password
    },
  })
}

const addTodo = (name, description, status, due_date, token) => {
  console.log('add todo')
  console.log(token)
  return $.ajax({
    method: 'POST',
    url: 'http://localhost:3000/api/todo',
    data: {
      name,
      description,
      status,
      due_date
    },
    headers: { user_token: token }
  })
}

const showError = errorMessage => {
  $('#alert').empty()
  $('#alert').append(`<span>${errorMessage}</span>`)
  $('#alert').show()
}

const getData = user_token => {
  return $.ajax({
    method: 'GET',
    url: `http://localhost:3000/api/todo`,
    headers: { user_token }
  })
}

const dataAppend = (items, token) => {
  return items.forEach(item => {
    $('#todocontainer').append(`
      <div class="row">
        <div class="col">
          <div class="card text-white mb-3 mx-auto" style="max-width: 90vh; background-color: #222222;>
            <div class="card-body">
              <h4 class="card-title" style="margin-top: 2rem">${item.name}</h4>
              <hr>
              <h5 class="card-text colorwhite">Description</h5>
              <p lass="card-text">${item.description}</p>
              <hr>
              <h5 class="card-text colorwhite">Status</h5>
              <p lass="card-text">${item.status ? "DONE" : "ONGOING"}</p>
              <hr>
              <h5 class="card-text colorwhite">Due Date</h5>
              <p lass="card-text">${item.due_date}</p>
              <hr>
              <div>
                <button id=${item._id} class="btn btn-primary add-button">ADD</button>
                <button id=${item._id} class="btn btn-primary edit-button">EDIT</button>
                <button id=${item._id} class="btn btn-primary delete-button">DELETE</button>
              </div>
            </div>
          </div>
        </div>
      </div>`)

    $('.delete-button').click(function (event) {
      console.log(event.target.id)
      $.ajax({
        method: 'DELETE',
        url: `http://localhost:3000/api/todo/${event.target.id}`,
        headers: { user_token: token }
      })
        .done(success => {
          getData(token)
            .done(items => {
              console.log(items)
              $('#todocontainer').empty()
              dataAppend(items, token)
            })
            .fail(err => {
              showError(err.responseJSON.msg)
              console.log(err)
            })
        })
        .fail(err => {
          showError(err.responseJSON.msg)
          console.log(err)
        })
    })

    $('.add-button').click(function (event) {
      $('#todocontainer').hide()
      $('#addtodocard').show()
    })
  })
}

$(document).ready(function () {
  $('#reg-menu').click(function (event) {
    event.preventDefault()
    // console.log('reg button clicked')
    $('#logincard').hide()
    $('#registercard').show()
  })

  $('#loginform').submit(event => {
    event.preventDefault();
    const email = $('#inputEmail').val();
    const password = $('#inputPassword').val();

    loginUser(email, password)
      .done(data => {
        console.log(data.token);
        $('#alert').hide()
        $('#login').hide()
        $('#content').show()

        getData(data.token)
          .done(items => {
            console.log(items.length)
            $('#todocontainer').empty()
            dataAppend(items, data.token)
          })
          .fail(err => {
            $('#todocontainer').hide()
            $('#addtodocard').show()
            console.log(err)
          })


        $('#addtodoform').submit(event => {
          event.preventDefault();
          const name = $('#inputTodoName').val();
          const description = $('#inputTodoDesc').val();
          const due_date = $('#inputDueDate').val();
          let status;
          new Date() > new Date(due_date) ? status = false : status = true

          addTodo(name, description, status, due_date, data.token)
            .done(success => {
              console.log(data)
              getData(data.token)
                .done(items => {
                  console.log(items)
                  $('#todocontainer').empty()
                  dataAppend(items, data.token)
                  $('#todocontainer').show()
                })
                .fail(err => {
                  showError(err.responseJSON.msg)
                  console.log(err)
                })
              $('#alert').hide()
              $('#login').hide()
              $('#content').show()
              // $('#todocontainer').show()
              $('#addtodocard').hide()
            })
            .fail(err => {
              showError(err.responseJSON.msg)
              console.log(err)
            })
        })

        // $('#addtodoform').submit(event => {
        //   event.preventDefault();
        //   const name = $('#inputTodoName').val();
        //   const description = $('#inputTodoDesc').val();
        //   const due_date = $('#inputDueDate').val();
        //   let status;
        //   new Date() > new Date(due_date) ? status = false : status = true

        //   addTodo(name, description, status, due_date, data.token)
        //     .done(data => {
        //       $('#alert').hide()
        //       $('#login').hide()
        //       $('#content').show()
        //       $('#todocontainer').show()
        //       $('#addtodocard').hide()
        //     })
        //     .fail(err => {
        //       showError(err.responseJSON.msg)
        //       console.log(err)
        //     })
        // })


      })
      .fail(err => {
        showError(err.responseJSON.msg)
        console.log(err)
      })
  })

  $('#registerform').submit(event => {
    event.preventDefault();
    const email = $('#inputEmailRegister').val();
    const password = $('#inputPasswordRegister').val();

    registerUser(email, password)
      .done(data => {
        console.log(data.token);
        $('#logincard').show()
        $('#registercard').hide()
      })
      .fail(err => {
        showError(err.responseJSON.msg)
        console.log(err)
      })
  })
})