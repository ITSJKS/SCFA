def nextGreatestLetter(letters, target):
    start = 0
    end = len(letters) -1

    # print(ord(target))
    # print(ord(letters[2]))

    ans = -1
    while end >= start:
        mid = (start+ end)//2

        if ord(letters[mid]) > ord(target):          
            ans = letters[mid]
            end = mid-1

        else:
            start   = mid+1

    if ans == -1:
        return letters[0]
    else:
        return ans