"""TO-DO: Write a description of what this XBlock is."""

import pkg_resources
from web_fragments.fragment import Fragment
from xblock.core import XBlock
from xblock.fields import Integer, Scope


class TeacherXBlock(XBlock):
    
    has_author_view=True;
    has_studio_view=True;

    def resource_string(self, path):
        """Handy helper for getting resources from our kit."""
        data = pkg_resources.resource_string(__name__, path)
        return data.decode("utf8")

    # TO-DO: change this view to display your data your own way.
    def student_view(self, context=None):
        """
        The primary view of the TeacherXBlock, shown to students
        when viewing courses.
        """
        html = self.resource_string("static/html/teacher_xblock.html")
        frag = Fragment(html.format(self=self))
        frag.add_css(self.resource_string("static/css/teacher_xblock.css"))
        frag.add_javascript(self.resource_string("static/js/src/teacher_xblock.js"))
        frag.initialize_js('TeacherXBlock')
        return frag

    @staticmethod
    def workbench_scenarios():
        """A canned scenario for display in the workbench."""
        return [
            ("TeacherXBlock",
             """<teacher_xblock/>
             """),
            ("Multiple TeacherXBlock",
             """<vertical_demo>
                <teacher_xblock/>
                <teacher_xblock/>
                <teacher_xblock/>
                </vertical_demo>
             """),
        ]
