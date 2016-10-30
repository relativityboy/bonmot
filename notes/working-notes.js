/**
 * The below are possible utility functions. Keeping them here for now because #bloatsucks
 *
 */

/**
 * Allows addition of Handlebars partials without needing to explicitly require Handlebars in extending views.
 * @param name
 * @param template
 * @param pass
 */
_export.registerPartial = function(name, template, pass) {
  if(!Handlebars.partials.hasOwnProperty(name)) {
    Handlebars.registerPartial(name, template);
  } else if((Handlebars.partials[name] !== template) && !pass) {
    throw new Error("Attempting to over-write handlebars partial " + name + " is not allowed");
  }
};

/**
 * Allows declaration of dependency on handlebars partials
 * @param templateNames
 */
_export.partialDependencies = function(templateNames) {
  templateNames = (DWBackbone.isA(templateNames) === 'Array')? templateNames : arguments;
  for(var i = 0; i < templateNames.length; i++) {
    if(!Handlebars.partials.hasOwnProperty(templateNames[i])) {
      throw new Error('Partial dependency error. Partial \'' + templateNames[i] + ' has not been added to Handlebars.partials.');
    }
  }
};