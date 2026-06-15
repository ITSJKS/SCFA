def nextGreatestLetter(letters, target):
    start = 0
    end = len(letters)-1
    ans = letters[0]
    
    while start<=end:
        mid = (start+end)//2
        if ord(letters[mid])>ord(target):
            ans = letters[mid]
            end = mid-1
        else:
            start = mid+1
    return ans