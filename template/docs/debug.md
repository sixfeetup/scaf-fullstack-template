# :bug: How to debug the application

The steps below describe how to set up interactive debugging. Scaf supports

* PyCharm
* VS Code

## PyCharm Debugging

### Setup

Update `k8s/base/app.configmap.yaml` with `data` field `PYTHONBREAKPOINT: "utils.pycharm_debugger"`

In PyCharm:

1. Go to 'Run' in the toolbar
2. Click on 'Edit Configurations'
3. Click on '+' in the top left of the dialog
4. Select 'Python Debug Server'
5. Set the host to 0.0.0.0 and the port to 6400, and the name as you see fit.
6. For 'path mappings' set /path/to/{{ copier__project_slug}}/backend=/app/src
7. Check 'Redirect console output to console'
8. Remove check on 'Suspend after connect'.
9. Click 'Ok'

![debug__debug_configuration.png](images/debug__debug_configuration.png)

### Debugging in development
Before the code you want to debug, add the following:

```python
breakpoint()
```

You must then set break points in PyCharm, and call the code as usual to hit them.

## VS Code Debugging

### Setup

Update `k8s/base/app.configmap.yaml` with `data` field `PYTHONBREAKPOINT: "utils.vscode_debugger"`

In VS Code:

1. Go to 'Run & Debug` tab
2. Click on 'create a launch.json file'
3. Choose 'Python Debugger'
4. Choose 'Remote Attach'
5. Set the host to `0.0.0.0`
6. Set the port to `5678`
7. VS Code will create a `.vscode/launch.json` with your configuration. Make any desired further changes, then save. The file should something look like:

```json
{
    // Use IntelliSense to learn about possible attributes.
    // Hover to view descriptions of existing attributes.
    // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [

        {
            "name": "Python Debugger: Remote Attach",
            "type": "debugpy",
            "request": "attach",
            "connect": {
                "host": "0.0.0.0",
                "port": 5678
            },
            "pathMappings": [
                {
                    "localRoot": "${workspaceFolder}",
                    "remoteRoot": "."
                }
            ]
        }
    ]
}
```

### Debugging in development

You can set break points in VS Code as normal, and call the code as usual to hit them.
