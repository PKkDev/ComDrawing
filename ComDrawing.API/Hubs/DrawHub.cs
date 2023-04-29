using ComDrawing.API.Controllers;
using ComDrawing.Share;
using Microsoft.AspNetCore.SignalR;

namespace ComDrawing.API.Hubs
{
    public class DrawHub : Hub
    {

        public override Task OnConnectedAsync()
        {
            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception? exception)
        {
            return base.OnDisconnectedAsync(exception);
        }

        public async Task Drawing(string groupName, string userName, DrawData data)
        {
            await Clients.Group(groupName).SendAsync("DrawReceived", userName, data);
        }

        public async Task MoveCursor(string groupName, string userName, CursorData data)
        {
            await Clients.Group(groupName).SendAsync("MoveCursorReceived", userName, data);
        }

        public async Task AddToGroup(string groupName, string userName)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);

            if (!GroupsController.TotalGroups.Contains(groupName))
                GroupsController.TotalGroups.Add(groupName);

            await Clients.Group(groupName).SendAsync("SendMessage", "System", $"{userName} has joined the group");
        }

        public async Task RemoveFromGroup(string groupName, string userName)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);

            await Clients.Group(groupName).SendAsync("SendMessage", "System", $"{userName} has left the group");
        }

        public Task SendMessageToGroup(string groupName, string userName, string message)
        {
            return Clients.Group(groupName).SendAsync("SendMessage", userName, message);
        }
    }
}
