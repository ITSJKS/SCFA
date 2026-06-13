def nextGreatestLetter(letters, target):
    ans = 0


    low = 0
    high = len(letters)-1

    while low <= high:
        mid = (low + high)//2

        if ord(letters[mid]) > ord(target):
            ans = letters[mid]
            high = mid - 1
        
        else:
            low = mid + 1
        
    if ans == 0:
        return letters[0]
    return ans