(function ($) {
  const formClassName = '.recipe-form';

  $(formClassName).on('input', '[name]', function () {
    const $form = $(this).parents(formClassName);
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

    const $submitButton = $form.find('[type="submit"]');
    $submitButton.prop('disabled', !screenValid);
  });
})(jQuery, window);
