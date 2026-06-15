'''
class Node:
def __init__(self, data):
self.data = data
self.next = None
'''

def swapPairs(head):
    arr = []

    cur = head
    while cur:
        arr.append(cur.data)
        cur = cur.next
    
    for i in range(1, len(arr), 2):
        arr[i - 1], arr[i] = arr[i], arr[i - 1]
    
    print(*arr)