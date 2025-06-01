$(function () {
    const container = $('#exercise-container');
    const noResults = $('.no-results');
    const errorBox = $('.error');
    const cardTemplate = $('#exercise-card-template');
  
    let allExercises = [];
  
    function renderExercises(filter = 'assegnati') {
      container.empty();
      noResults.hide();
      errorBox.hide();
  
      const filtered = allExercises.filter(ex => {
        if (filter === 'assegnati') return !ex.completato;
        if (filter === 'completati') return ex.completato;
        return true;
      });
  
      if (filtered.length === 0) {
        noResults.show();
        return;
      }
  
      filtered.forEach(ex => {
        const card = cardTemplate[0].content.cloneNode(true);
        $(card).find('.exercise-img').attr('src', ex.immagine || '../../images/giochi/default.png');
        $(card).find('.exercise-name').text(ex.nome);
        $(card).find('.exercise-type').text(`Tipologia: ${ex.tipologia}`);
        $(card).find('.exercise-note').text(ex.note || '');
        const badge = $(card).find('.badge');
        badge.text(ex.completato ? 'Completato' : 'Assegnato');
        badge.addClass(ex.completato ? 'completato' : 'assegnato');
        container.append(card);
      });
    }
  
    function fetchExercises() {
      $.ajax({
        url: '/api/esercizi',
        method: 'GET',
        dataType: 'json',
        success: function (data) {
          allExercises = data;
          renderExercises('assegnati');
        },
        error: function () {
          container.empty();
          errorBox.show();
        }
      });
    }
  
    $('.filter-btn').on('click', function () {
      $('.filter-btn').removeClass('active');
      $(this).addClass('active');
      const filter = $(this).data('filter');
      renderExercises(filter);
    });
  
    fetchExercises();
  });