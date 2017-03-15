from modelaccessor import ModelAccessor
import pytz
import datetime
import time

class CoreApiModelAccessor(ModelAccessor):
    def __init__(self, orm):
        self.orm = orm
        super(CoreApiModelAccessor, self).__init__()

    def get_all_model_classes(self):
        all_model_classes = {}
        for k in self.orm.all_model_names:
            all_model_classes[k] = getattr(self.orm,k)
        return all_model_classes

    def fetch_pending(self, main_objs, deletion=False):
        if (type(main_objs) is not list):
                main_objs=[main_objs]

        objs = []
        for main_obj in main_objs:
            if (not deletion):
                lobjs = main_obj.objects.filter_special(main_obj.objects.SYNCHRONIZER_DIRTY_OBJECTS)
            else:
                lobjs = main_obj.objects.filter_special(main_obj.objects.SYNCHRONIZER_DELETED_OBJECTS)
            objs.extend(lobjs)

        return objs

    def obj_exists(self, o):
        # gRPC will default id to '0' for uninitialized objects
        return (o.id is not None) and (o.id != 0)

    def obj_in_list(self, o, olist):
        ids = [x.id for x in olist]
        return o.id in ids

    def now(self):
        """ Return the current time for timestamping purposes """
        utc = pytz.utc
        now = datetime.datetime.utcnow().replace(tzinfo=utc)
        return time.mktime(now.timetuple())

    def is_type(self, obj, name):
        return obj._wrapped_class.__class__.__name__ == name

    def is_instance(self, obj, name):
        return name in obj.class_names.split(",")

    def get_content_type_id(self, obj):
        return obj.self_content_type_id



