def nextGreatestLetter(letters, target):
    # s, e = 0, len(letters)-1
    # ans = -1
    # while s<=e:
    #     mid = (s+e)//2
    #     if ord(letters[mid]) > ord(target):
    #         ans = letters[mid]
    #         e = mid-1
    #     else:
    #         s = mid+1
    # return ans

    for i in range(ord(target)+1, 123):
        if chr(i) in letters:
            return chr(i)
    return letters[0]