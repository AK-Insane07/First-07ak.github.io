from collections.abc import Iterable

from google.protobuf.descriptor import Descriptor, EnumDescriptor, FileDescriptor, ServiceDescriptor
from google.protobuf.message import Message
from google.protobuf.message_factory import MessageFactory

class SymbolDatabase(MessageFactory):
    def RegisterMessage(self, message: type[Message] | Message) -> type[Message] | Message: ...
    def RegisterMessageDescriptor(self, message_descriptor: Descriptor) -> None: ...
    def RegisterEnumDescriptor(self, enum_descriptor: EnumDescriptor) -> EnumDescriptor: ...
    def RegisterServiceDescriptor(self, service_descriptor: ServiceDescriptor) -> None: ...
    def RegisterFileDescriptor(self, file_descriptor: FileDescriptor) -> None: ...
    def GetSymbol(self, symbol: str) -> type[Message]: ...
    def GetMessages(self, files: Iterable[str]) -> dict[str, type[Message]]: ...

def Default() -> SymbolDatabase: ...
