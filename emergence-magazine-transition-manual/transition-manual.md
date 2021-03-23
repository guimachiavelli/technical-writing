# EM Transition Manual

## Introduction

This is documentation of the Emergence Magazine website. This site is based on Wordpress and built on top of a Roots stack. It was created and actively developed between 2017 and 2020 by @guimachiavelli, with occasional contributions by @kpoelhoekke.

It does not reflect any changes made to the codebase after February 2020, the month in which transition between development teams took place.

Note: sensitive information has been redacted for this public version.

### Document purpose
The main purpose of this document is to allow a smooth transition between development teams.

In order to do that, this document explains:

1. the steps needed to set up a local install of the Emergence Magazine website;
2. how to deploy it to both staging and production environments;
3. a brief overview of how the site is currently set up;
4. how to develop a custom template plugin;
5. how to publish a new issue.

Extensively documenting the codebase is outside the scope of what we're doing here. This is due to the fact that the current website should have only two more issues, one of which is mostly done (issue #7 --- Trees), so it seems unlikely that issue #8 will require major changes to the underlying structure.

### Dependencies
Before starting, make sure you have these installed in your computer.

* `Ansible 2.7.5`
* `Vagrant 2.2.6`
* `VirtualBox 6.0.4`
* `Composer 1.9.1`
* `Yarn 1.21.1`

The versions indicated here are the ones currently in use and known to work (e.g. more up-to-date versions of Ansible have deprecated certain CLI arguments and this may cause problems when setting up the local dev machine and/or deploying to staging and production).

### Versioning
Every deployment to production should have corresponding commit tagged on the git repository. This is currently done manually and, although inspired by semantic versioning, has its own logic:

* Major version number: updated quarterly with every new issue. For example, issue #1 is `v1.0.0` and issue #2 is `v2.0.0`;
* Minor version number: updated with maintenance releases. Time between releases varies between one to three weeks;
* Patch: only released to fix critical, functionality-breaking issues. Released as soon as possible. Emergencial in nature.

Though not critical, keeping versions has been occasionally helpful in finding the source of an issue.

## Development

Emergence Magazine has been developed on a Roots base, using Trellis for setting up servers both locally and remotely, Bedrock for handling Wordpress configuration and Sage as a base template. The first two have remained fairly untouched; but we have changed some aspects of Sage (mainly concerning compiling tasks, adding new controllers and extending some functionality).

Most of the active development for EM nowadays concerns  custom plugins that either add new templates (e.g. a new page, issue or story) or extend existing functionality (e.g. a promotional pop up on page load).

### Content structure
As most of the website, the structure of the website has seen some revisions as the magazine grew and its requirements changed (something particularly clear in mandatory fields such as contributors and hero images: although the initial rule was that all stories would have those fields, this eventually turned out to be untrue to some stories). The current state is far from ideal and would benefit from some cleanup. Outlining all of those is probably not useful at this point, as most issues will be addressed on the new website.

#### Stories
The main post type is `story`. Content is inserted through ACF fields, the majority of which are self-explanatory. These fields are the same for all stories that follow the default template.

Custom templates keep header, hero, contributors and some metadata fields (categories, story type, etc), but have no content fields. These need to be supplied by the custom template itself -- sometimes these are exactly the same as a regular story, in which case you can safely create a `clone`-type ACF field.

For more information on how to build custom templates, check the relevant heading in this document.

#### Issues
`stories` are mainly accessed through `issue`s, the second custom post type. Not to be understood as technical issues (i.e. Github issues) but as a print magazine's issues. As of issue #5, each issue has three main fields:

1. Featured story: the story chosen to be featured on that issue's cover;
2. Listing: a repeater fields that allows the client to add stories, image sliders and subscribe to our newsletter blocks;
3. Practice: the story chosen as the practice for that issue, the last thing before the issue page's footer.

#### Contributor
A third custom post type, `contributor`, should require no intervention (it's actually one of the few things that has not changed at all since launch) and is mentioned now just for the sake of completeness.

`contributor` posts require only a title and textual content. Though the original idea was that they would be displayed in every `story`, this has since changed due to the fact some texts have no clear author and others credit the contributors in different ways. As such, `contributor`s are often not used for custom templates.

### Themes, Templates and Plugins
Development of the main theme and the first issue templates happens on `[project root]/site/web/app/themes/emergence`. It is very unlikely you will need to touch it --- the code there has grown organically and withstood several design and functionality changes (sometimes in a very quick pace), so, although it isn't pretty, it is stable.

#### Issues #1 to #3
All custom templates and pages in these issues are tied to the main build process, which is pretty much `Sage 9.0.0`'s  build process. For development, we recommend using `yarn build:watch`. Also available is `yarn start`, which sets up a `browsersync` proxy accessible on `http://localhost:3000` --- due to how Sage set this up, it can cause scripts to load before styles have been applied, which can cause problems if you need to calculate an element's size/position in the document.

#### Issue #4
Due to increasingly long compile times, we used issue #4 as a test run for separating templates, issues and new components (e.g. newsletter pop-ups, new staff picks/related posts sliders) as custom wordpress plugins with their own tooling and structure. Importantly, since this was still a test, the code for these has been committed to the main repo. Thus, if you need to change anything specifically for issue #4, go to `[project root]/site/web/app/plugins/` and search for the desired template (e.g. `emergence-issue-faith`).

It is out of the scope of this document to explain specific workflows for each custom plugin, but, generally speaking, to start making any changes, go to the `trellis` folder, run `vagrant up` and navigate to the relevant  plugin folder (e.g. `[redacted]`).

#### Issues >= #5
The tests made on issue #4 were very successful in improving development speed and ease-of-use, so we adopted this workflow in all subsequent issues. The process is pretty much the same as issue #4 with one big difference: each plugin gets its own repository and is installed via composer. Meaning, remember to push your changes to the plugin repository and, once you're done with your changes, run `compose update [plugin name]` from `[project root]/site`.

#### Templating
All templates in the website use Laravel's blade. This was a choice that came bundled in with Sage and we just went along with it. As far as development goes, it isn't much different than writing regular php, though it feels more idiomatic to leave as much logic as possible out of `.blade` files.

Both ourselves and other developers we have worked with in the past have had rare problems with `blade`'s cache getting stuck and not refreshing. In case that happens, you can safely delete `uploads/cache` to clear it in a development machine.

## Server

### Local
After cloning the repository, go to `[project root]/trellis`, configure the environment variables (reasonable defaults are already in place, but in case you need to change any anything please consult Trellis' documentation).

Finally, run `vagrant up`. The process should set up a virtual machine on your computer, install composer dependencies and update your hosts file (your password may be required for this last step). Make sure your SSH keys are in place and that your user has access to all Emergence Magazine repositories, as most custom plugins are installed from these repositories. Some machine setups might need SSH to have `ForwardAgent` enabled.

Once vagrant set up and provision are finished, move to `[project root]/site/web/app/themes/emergence` and run `npm install` followed by `yarn install`. Once all front-end dependencies have been installed, you should be able to start development.

A recent dump of the production database should be available on (`[project root]/site/[redacted]`). To import it, use the WP CLI `wp db import` tool from your vagrant box. You will probably want to also run a `wp search-replace` on the imported database to replace references to the production URL to your local address. To ssh into your vagrant box, run `vagrant ssh` from your `trellis` directory.

By default, the dev URL is `http://emergence.test`. The back-end interface can be accessed through `http://emergence.test/wp/wp-admin`.

### Remote
Staging and Production are deployed to different hosts. Front-end assets are compiled locally, but all other files are cloned directly from the repository. Staging clones the `develop` branch, Production clones the `master` branch.

#### Staging
Provision takes care of setting up any server with root ssh access from scratch on the first run and updates any server settings (such as public keys) on following runs. To set up EM on a new server, follow these steps:

1. add github.keys to `admin` and `web_user` on `group_vars/all`;
2. make sure ssh forwarding is configured correctly. This requires, at a minimum, ensuring that your ssh config includes `ForwardAgent Yes`;
3. provision server (see above);
4. run `ansible-playbook deploy.yml -e "site=emergencemagazine.com env=staging"`

#### Production
Contegix automatically blocks any IP addresses that attempt to ssh as root. Provisioning playbooks must be run with extra flags:

	ansible-playbook server.yml -e env=production -u spiriteco1 --ask-pass


For anything else that might have to be done on the server and that is not covered by trellis, prefer using the `[redacted]` user as it should have all the necessary permissions.

Once the remote server has been set up, deploy with `ansible-playbook deploy.yml -e "site=emergencemagazine.com env=production"`

#### macOS and SSH keys
In recent versions of macOS (>= Sierra/10.12), you might need to run `ssh-add -K` to ensure ssh tunnelling works.

## Custom template/plugin development

Developing a custom template is similar to developing a standalone website, though within the constraints of Wordpress and, optionally, of the default EM story template.

Each template should be contained in its own repository.

Custom templates are usually story templates, but could also be a page.

Though this section talks about custom templates, most of these steps can be safely followed when developing an issue template, a new page template or a new component plugin.

### Structure
Though not mandatory, the custom plugins developed so far all follow very similar structures to keep some semblance of order. A good starting point for new custom templates would be to copy one of the examples and alter necessary slugs, variables and etc.

As a minimum, any new template must have:

* `[plugin-name].php`: holds most of the logic required to set up a new template inside a static class, including registering the main template file in wordpress custom template listings, registering the blade template namespace, loading ACF fields from the `acf` folder and conditionally enqueuing assets (e.g. js, css) from the `dist` dir;
* `composer.json`: mainly used so it can be recognised by composer as a valid custom plugin;
* `views`: contains the template html and any necessary partials. Can be as simple as a `.blade` file extending a layout with an empty div or full-blown html with partials;

Everything else is pretty much open to whatever the developer believes best fits their needs. We tend to store acf fields on the `acf` folder, have a `src` folder containing images, js and css files that are compiled/post-processed into a `dist` folder, and, sometimes, `controllers`.

If using a different structure, be careful to edit the appropriate sections on `[plugin-name].php`. E.g. removing the code that loads assets from `dist` if not loading assets from that location.

### Development
Once the structure has been set up, simply develop the template following whatever workflow makes the most sense to you, with a few comments and suggestions below.

#### Workflow
We usually create the plugin and its repo inside the `[project_root]/site/web/app/plugins` folder (e.g. `[project_root]/site/web/app/plugins/[plugin-name]`). Though this might prompt warnings regarding the creation of a repository within a repository, this has not (so far) resulted in any actual problems and is a better approach then setting up a new vagrant instance for each new custom template.

#### Template view
If re-using UI elements of the default template is desired, the recommended way is to use Laravel's blade templating language and extending the `year2::main` layout.

This layout has two sections, header and content.

##### Header
Expects one component, usually `year2::header`. `year2::header` has one slot, `subtitle`. If undeclared, defaults to title of the page; an empty value must be explicitly passed to hide it.

##### Content
Probably all your content will be inserted here, little else to say.

### Deployment
Before deploying, it is necessary to add the custom plugin to the website's `composer.json` manifest.

#### First deploy
To deploy changes to either staging or production environments, first add it to the site's `composer.json`:

1. commit and push the latest version of the plugin to its repository;
2. open `[project_root]/site/composer.json`;
3. add the repo address of your plugin under `repositories`. E.g.:

	  {
	    "type": "vcs",
	    "url": "git@bitbucket.org:studioairport/[plugin-name].git"
	  },

1. under `require`, add the plugin with the name you established on your plugin's composer.json as well as `dev-` followed by the branch name. E.g.:  `"studioairport/emergence-staff-picks": "dev-master"`;
2. exit the file and run `composer update [plugin-name]`.

warning: if you have any unpushed changes your local machine at this point, they will be overwritten by composer update.

After this, follow the usual deployment steps.

#### Further deploys
Run `composer update [plugin-name]` from `[project_root]/site/composer.json`, then follow the usual deployment steps.

#### Examples
`[redacted]`: a complex, react-based template that uses very little from the default story template (namely: menu, logo, share buttons). This is a good representation of the complexity of the featured stories;

`[redacted]`: a different type of custom template which changes very little from the default template. It is kept within a plugin in order to avoid conflicts and needlessly increasing the complexity of an already overloaded editing UI.

### Publishing a new issue
The current website should have only one more issue after January, issue #8 --- Apocalypse, so this process will most likely only have to be done once.

1. Create a new plugin, most likely heavily-based on `[redacted]`. Replace all references from trees to apocalypse (slugs, classes, views, etc), especially on `composer.json` and `emergence-issue-trees.php`. Make sure to add a template file inside `views`;
2. work on the issue template as usual;
3. once ready, deploy issue the same way as you would deploy a custom template;
4. go to the wordpress admin, Issues > Apocalypse;
5. on the `_page attributes_` select field, assign the template to the issue.

In general, development is very similar to any other custom plugin. You can safely follow the guidelines explained on the previous section.



## Appendix A: Developing things other than story, issue and page templates

We believe it is unlikely the current version of the website will need any new functionality. In case you do need to do so, it shouldn't be radically different from developing a custom template.

We would recommend keeping the approach of touching the theme files as little as possible and do most of the work through hooks, possibly creating a new one if needed.

### Examples

* `[redacted]`: one thing we have had to do a few times already was to create a pop-up-like notification regarding the release of a printed issue or a nomination for an award. This is done by adding a filter to the custom hook `EM_display_newsletter_popup` that removes the regular newsletter subscription pop-up and use the `wp_footer` hook to display this plugin's  notification.
* `[redacted]`: a bit more complex, this component replaces the previous staff picks with a new design.
