# You found it

Welcome to my portfolio! This is a `Portfoli-OS`, where I demonstrate my work
and skills in an OS-like UI web application.

## Terminal usage

Let's start with the basis one: the terminal. You can type `help` to get a list
of available commands. You can also type `help <command>` to get more
information about a specific command. For example

```txt
help cd

# Output:
Usage: cd [OPTION] [DIR]

Change the current directory to DIR.  The default DIR is the value of the
is the current directory.

- If DIR begins with a slash (/), then command will redirect to the root of
the file tree and continue from there.
- If DIR is (~) its equivalency in absolute path is (/home/guess).
- If DIR is (-), the command will redirect to the previous directory.
- If DIR is (..), the command will redirect to the parent directory.

Options:
      --help                display this help and exit.
      --version             output version information and exit.
```

You can also create your own directories and files with the `mkdir` and `touch`.
However, you only have permission to do so in the `home` directory. Other
directories are read-only, like this one.

> Try using `cd ~` to get back to your home directory.

By default, your created files will be not saved automatically. You can save
them by selecting the option `Save` in the menu.

Want to know how this implementation works? Check out the source code here:
[Terminal](https://github.com/richardnguyen99/portfolios/tree/main/src/components/Terminal)

## Windows

All programs, including the terminal you are using, are built on top of the
window component. Window components are draggable and resizable. You can also
minimize, maximize, and close them, by either clicking or using hotkeys.

Try `Ctrl + Alt + w` to see what happens.

All windows are managed by a context called `ModalContext`. This context will
keep track of all the windows and their states.

Want to know how this implementation works? Check out the source code here:
[Window](https://github.com/richardnguyen99/portfolios/tree/main/src/components/Window)
