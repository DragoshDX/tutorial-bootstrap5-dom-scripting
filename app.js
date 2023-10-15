(function ($, w) {
  const formClassname = '.recipe-form';
  const $mobileOverlay = $(formClassname + ' .overlay');
  const maxSteps = 3;
  let currentStep = 1;

  $(formClassname)
    .on('click', '.hero-button', function (event) {
      event.preventDefault();
      const $heroButton = $(this);
      const $form = $heroButton.parents(formClassname);
      const $tabs = $form.find('.tab-content');

      if (currentStep === maxSteps) {
        $heroButton.text('Finalizează rețeta');
        $heroButton.attr('type', 'submit');
      } else {
        // garantat va fi problema in momentul
        // in care facem back
        currentStep = currentStep + 1;
        $tabs
          .hide()
          .eq(currentStep - 1)
          .show();
      }

      validateStep(this);
    })
    .on('change', '#add-author', function () {
      const $authorCheckbox = $(this);
      const $form = $(this).parents(formClassname);
      const $authorFields = $form.find(
        '[data-conditionally-required][name^=recipe-author]',
      );

      if ($authorCheckbox.is(':checked')) {
        $authorFields.attr('required', true);
      } else {
        $authorFields.removeAttr('required');
      }

      validateStep(this);
    })
    .on('input', '[name]', function () {
      validateStep(this);
    });

  $(formClassname + ' .add-ingredient').on('click', function () {
    const $addIngredientButton = $(this);
    const $addIngredientFieldset = $(
      formClassname + ' .add-ingredient-fieldset',
    );

    if (isLowRes('lg')) {
      $addIngredientFieldset.show();
      $mobileOverlay.show();
    } else {
      // DRY: extractFieldsetData($oarecare)
      const $ingredientFields = $addIngredientFieldset.find('[name]');
      const fieldInformation = [];
      let areFieldsValid = true;

      $ingredientFields.each(function () {
        const $input = $(this);
        const value = $input.val();

        if (value.trim() < 1) {
          areFieldsValid = false;

          return;
        }

        fieldInformation.push({
          name: $input.attr('name'),
          value: value,
        });
      });

      if (areFieldsValid !== true || fieldInformation.length === 0) {
        return;
      }
      // DRY

      const $recipeIngredientsSelect = $addIngredientButton
        .parents(formClassname)
        .find('[name="recipe-ingredients"]');

      // Rosii-150-g
      const optionValue = fieldInformation
        .map(function (fieldInformation) {
          $(formClassname + ` [name=${fieldInformation.name}]`).val('');

          return fieldInformation.value;
        })
        .join('-');

      const $option = $('<option>', {
        value: optionValue,
        selected: true,
        text: optionValue,
      });

      $recipeIngredientsSelect.append($option).trigger('input');
    }
  });

  $(formClassname + ' .btn-close').on('click', function () {
    const $closeButton = $(this);
    $closeButton.parents('fieldset').hide();
    $mobileOverlay.hide();
  });

  function validateStep(element) {
    const $form = $(element).parents(formClassname);
    const $visibleRequiredInputs = $form.find('[required]:visible');
    let screenValid = true;

    $visibleRequiredInputs.each(function () {
      if (screenValid === false) {
        return;
      }

      const $input = $(this);

      if ($input.is(':valid') === false) {
        screenValid = false;
      }
    });

    const $submitButton = $form.find('.hero-button');
    $submitButton.prop('disabled', !screenValid);
  }

  function isLowRes(breakpoint = 'lg') {
    const breakpointMap = {
      lg: 992,
    };
    const windowSize = $(w).outerWidth();

    // if (breakpointMap[breakpoint] < windowSize) {
    //   return true;
    // }

    // return false;

    return windowSize < breakpointMap[breakpoint];
  }
})(jQuery, window);
