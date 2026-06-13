def swapPairs(head):
    if head is None:
        return None
    if head.next is None:
        return head    
    
    count = 0
    curr = head
    
    # Check if at least 2 nodes exist
    while curr and count < 2:
        count += 1
        curr = curr.next
        
    if count < 2:
        return head
    
    curr = head
    count = 0  
    prev = None 
    
    # Reverse 2 nodes
    while curr and count < 2:
        nxt = curr.next
        curr.next = prev
        prev = curr 
        curr = nxt
        count += 1
    
    # Connect rest
    if curr is not None:
        head.next = swapPairs(curr)
    
    return prev