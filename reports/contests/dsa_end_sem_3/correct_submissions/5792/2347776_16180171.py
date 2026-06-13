def nextGreatestLetter(letters, target):
    start = 0
    end = len(letters)-1
    ans = 0
    while start<=end:
        mid = (start+end)//2
        if ord(letters[mid])==ord(target):
            start = mid+1
        elif ord(letters[mid])>ord(target):    
            end = mid-1
            ans = ord(letters[mid])
        else:
            start = mid+1
    if ans==0:
        return letters[0]    
    else:
        return chr(ans)