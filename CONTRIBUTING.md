# Guidance on how to contribute
There are two primary ways to help:
 - Using the issue tracker.
 - Changing the code base.


## Using the issue tracker

We have one issue tracker for both the website's frontend and backend. You can find this [here](https://github.com/td-org-uit-no/tdctl-frontend/issues). When looking for ways to contribute, it is probably easier to check our [github project](https://github.com/orgs/td-org-uit-no/projects/2) instead, all created issues appear here and get reviewed by the maintainers of the site. We recommend only working on issues that have been accepted into the project backlog.

Use the issue tracker to find ways to contribute. Find a bug or a feature, and mention it in the issue that you will take on that effort, then follow the [_Changing the code-base_](#changing-the-code-base) guidance below.


## Changing the code-base

Generally speaking, you should create a new branch in this repository, make changes in your
branch, and then submit a pull request. All new code should have associated
unit tests that validate implemented features and the presence or lack of defects.
Additionally, the code should follow any stylistic and architectural guidelines the project prescribes. In the absence of such guidelines, mimic the styles and patterns in the existing code-base.

All branch names should be of the form ```[type]/[branchname]```. The type of branch should describe the purpose of the branch. 

Typical types are:
* ```feature``` - The branch implements new feature(s)
* ```fix``` - The branch implements fixes to earlier work
* ```documentation``` - The branch provides documentation to the project
* ```security``` - The branch provides security updates to the project
You can use other types if it is more descriptive.

For the branch name we exepect the name to be descriptive and snake cased with underscores.

*Here are a couple of examples*
* ```feature/register_event_attendees```
* ```documentation/readme```
* ```fix/pyjwt_upgrade```
 
 ### Formating of code
 We expect all code to be formated correctly before a pull request is made. Luckily, this is made easy for us with the [Prettier](https://prettier.io) tool. 

 To use the tool, follow these steps.

 1. Run the container in the background
    ```bash
    ./dev_utils compose up -d
    ```
 2. Open a interactive shell within the container
    ```bash
    ./dev_utils exec
    ```
 3. Run the [Prettier](https://prettier.io) tool on the ```src``` folder
    ```bash
    yarn run prettier --write ./src
    ```
## Git history
> Check out our [git history](https://github.com/td-org-uit-no/tdctl-api/commits/master) for examples on how commit messages should be written.

We take pride in our git history and keep it as linear and clean as possible. Therefore, we use a descriptive [gitmoji](https://gitmoji.dev) as the first character in our commit message and expect all commit messages to be written future tense. This means all messages should be written so that they can precede the sentence _"This commit will [your commit message]"_.

### Rewriting git history
> There are several ways to rewrite git histories; this is just one example of how it can be done. Feel free to use the method you are most familiar with.

We don't care about the git history on your local machine or your private branch. Therefore, you can commit as often and with whatever message you like on your branch. However, when you create a pull request, we expect you to rewrite your git history to comply with the standards mentioned in the previous section.

This can be done using the command ```git rebase HEAD~[number of commits] -i```.

*Let's look at an example case where we have created two files and then edited those two files*
1. We check our git history by using the command ```git log```
    ```
    $ git log

    commit a5ee74e21a4302979448d8e340e6e63d1401c389 (HEAD -> master)
    Author: Example mCexampleson <example@mail.com>
    Date:   Wed Apr 12 12:47:09 2023 +0200

        Wrote 'this is fileC' in file C

    commit b0de2280086df24b558674ae5e8ff47001aef161
    Author: Example mCexampleson <example@mail.com>
    Date:   Wed Apr 12 12:46:26 2023 +0200

        Wrote 'this is fileB' in file B

    commit d7c3dbc8fa39479a3080ce7ff4c9b6a051a2228d
    Author: Example mCexampleson <example@mail.com>
    Date:   Wed Apr 12 12:45:53 2023 +0200

        Added file C

    commit ea91127abe8ecbe8daed44658578b01182fad060
    Author: Example mCexampleson <example@mail.com>
    Date:   Wed Apr 12 12:45:38 2023 +0200

        Added file B

    commit e3060d537dc5ce071a874b705d971353ac7e4134
    Author: Other TeamMember <other.teammember@mail.com>
    Date:   Wed Apr 12 12:44:11 2023 +0200

        :sparkles: add file A to project
    ```
    From this log, we see that we created the files in two separate commits and then edited the files. The first commit was written by another team member and is composed in the correct standard.

2. Let's say we don't want the creation of the files to be a separate commit from the editing of the file. So we use the command ```git rebase HEAD~4```, this opens up our default text editor with a file looking like this:
    ```
    pick ea91127 Added file B
    pick d7c3dbc Added file C
    pick b0de228 Wrote 'this is fileB' in file B
    pick a5ee74e Wrote 'this is fileC' in file C

    # Rebase e3060d5..a5ee74e onto e3060d5 (4 commands)
    #
    # Commands:
    # p, pick <commit> = use commit
    # r, reword <commit> = use commit, but edit the commit message
    # e, edit <commit> = use commit, but stop for amending
    # s, squash <commit> = use commit, but meld into previous commit
    # f, fixup [-C | -c] <commit> = like "squash" but keep only the previous
    #                    commit's log message, unless -C is used, in which case
    #                    keep only this commit's message; -c is same as -C but
    #                    opens the editor
    # x, exec <command> = run command (the rest of the line) using shell
    # b, break = stop here (continue rebase later with 'git rebase --continue')
    # d, drop <commit> = remove commit
    # l, label <label> = label current HEAD with a name
    # t, reset <label> = reset HEAD to a label
    # m, merge [-C <commit> | -c <commit>] <label> [# <oneline>]
    # .       create a merge commit using the original merge commit's
    # .       message (or the oneline, if no original merge commit was
    # .       specified); use -c <commit> to reword the commit message
    #
    # These lines can be re-ordered; they are executed from top to bottom.
    #
    # If you remove a line here THAT COMMIT WILL BE LOST.
    #
    # However, if you remove everything, the rebase will be aborted.
    #
    ```

3. The first four lines correspond to the commits we want to change. By moving the lines up and down, we can change the chronology of our git commits. For example, let's move our commits so that the edit of file B happens chronologically after its creation and the same with file C.
    ```
    pick ea91127 Added file B
    pick b0de228 Wrote 'this is fileB' in file B
    pick d7c3dbc Added file C
    pick a5ee74e Wrote 'this is fileC' in file C
    ```
4. We can now specify that commit ```b0de228``` and commit ```a5ee74e``` are fixups of the previous commit. The keyword _fixup_ tells git to meld the commit in question with the previous commit and keep the previous commit's message.
    ```
    pick ea91127 Added file B
    fixup b0de228 Wrote 'this is fileB' in file B
    pick d7c3dbc Added file C
    fixup a5ee74e Wrote 'this is fileC' in file C
    ```

5. However, our commit messages do not follow the standards we demand in this project. We can fix this with the _reword_ keyword. The reword keyword will stop the rebasing when it occurs and prompt us to write a new commit message.
    ```
    reword ea91127 Added file B
    fixup b0de228 Wrote 'this is fileB' in file B
    reword d7c3dbc Added file C
    fixup a5ee74e Wrote 'this is fileC' in file C
    ```

6. Once we save and close the file, git will start rebasing, applying the changes as we have written them. Immediately, the default text editor opens up again with this prompt.
    ```
    Added file B

    # Please enter the commit message for your changes. Lines starting
    # with '#' will be ignored, and an empty message aborts the commit.
    #
    # Date:      Wed Apr 12 12:45:38 2023 +0200
    #
    # interactive rebase in progress; onto e3060d5
    # Last command done (1 command done):
    #    reword ea91127 Added file B
    # Next commands to do (3 remaining commands):
    #    pick b0de228 Wrote 'this is fileB' in file B
    #    reword d7c3dbc Added file C
    # You are currently editing a commit while rebasing branch 'master' on 'e3060d5'.
    #
    # Changes to be committed:
    #       new file:   fileB
    #
    ```
7. We can now change the commit message to whatever we want. Let us write a new message that complies with our standards. Remember, future tense, and prepend the message with a gitmoji.
    ```
    :sparkles: create fileB with the contents 'this is fileB'
    ```
8. We can save and exit the file again, and git will continue until the next _reword_ keyword. This tutorial skips the next rewording, but the process is the same. Once git has run through all the steps we changed, we get the following message.
    ```
    [detached HEAD 5e3bec8] :sparkles: create fileB with the contents 'this is fileB'
     Date: Wed Apr 12 12:45:38 2023 +0200
     1 file changed, 0 insertions(+), 0 deletions(-)
     create mode 100644 fileB
    [detached HEAD 1d34369] :sparkles: create fileC with the contents 'this is fileC'
     Date: Wed Apr 12 12:45:53 2023 +0200
     1 file changed, 0 insertions(+), 0 deletions(-)
     create mode 100644 fileC
    Successfully rebased and updated refs/heads/master
    ```
9. Looking at the git history, we can see that the changes have occurred and are ready for our code review.
    ```
    $git log
    commit ab3ca3d97c405df2784f1fa2861e9de60bc2b10d (HEAD -> master)
    Author: Example mCexampleson <example@mail.com>
    Date:   Wed Apr 12 12:45:53 2023 +0200

        :sparkles: create fileC with the contents 'this is fileC'

    commit c23fe301b5d01967800c70ca509b8dfb6849c7c1
    Author: Example mCexampleson <example@mail.com>
    Date:   Wed Apr 12 12:45:38 2023 +0200

        :sparkles: create fileB with the contents 'this is fileB'

    commit e3060d537dc5ce071a874b705d971353ac7e4134
    Author: Other TeamMember <other.teammember@mail.com>
    Date:   Wed Apr 12 12:44:11 2023 +0200

        :sparkles: add file A to project
    ```
10. To overwrite the git history on the remote branch we have to push with force
    ```
    git push --force
    ```