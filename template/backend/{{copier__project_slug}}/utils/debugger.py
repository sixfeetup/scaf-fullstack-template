import logging
import os

logger = logging.getLogger(__name__)


def pycharm_debugger():
    logger.info("Pycharm pydevd connecting...")
    import pydevd_pycharm

    host_ip = os.getenv("DOCKER_GATEWAY_IP")
    try:
        pydevd_pycharm.settrace(
            host_ip, port=6400, stdoutToServer=True, stderrToServer=True, suspend=False
        )
    except ConnectionRefusedError:
        msg = "Debugger connection failed. Check IDE debugger is running and try again. Continuing without debugger."
        logger.error(msg.upper())


def vscode_debugger():
    raise NotImplementedError("VSCode debugger not implemented")
