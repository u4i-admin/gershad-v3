from django.core.cache import cache
from django.db import models
from django.db.utils import ProgrammingError


class SingletonModel(models.Model):

    def save(self, *args, **kwargs):
        self.pk = 1
        self.id = 1
        super(SingletonModel, self).save(*args, **kwargs)
        self.set_cache()

    def delete(self, *args, **kwargs):
        pass

    @classmethod
    def load(cls):
        if cache.get(cls.__class__.__name__) is None:
            try:
                obj, created = cls.objects.get_or_create(pk=1)
            except ProgrammingError:
                return None

            if created:
                obj.set_cache()
        return cache.get(cls.__class__.__name__)

    def set_cache(self):
        cache.set(self.__class__.__name__, self)

    class Meta:
        abstract = True
