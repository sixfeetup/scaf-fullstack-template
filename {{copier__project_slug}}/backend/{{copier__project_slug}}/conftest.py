import pytest
{%- if copier__create_nextjs_frontend %}
from strawberry_django.test.client import TestClient
{%- endif %}

from {{ copier__project_slug }}.users.models import User
from {{ copier__project_slug }}.users.tests.factories import UserFactory


@pytest.fixture(autouse=True)
def media_storage(settings, tmpdir):
    settings.MEDIA_ROOT = tmpdir.strpath


@pytest.fixture
def user() -> User:
    return UserFactory()


{% if copier__create_nextjs_frontend -%}
@pytest.fixture
def graphql_client() -> TestClient:
    return TestClient("/graphql/")
{%- endif %}
