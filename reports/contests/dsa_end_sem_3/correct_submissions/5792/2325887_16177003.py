def nextGreatestLetter(letters, target):

    low = 0
    high = len(letters)-1

    while high>low:
        mid = (low+high)//2
        # print(low,high,mid)

        if letters[mid]<=target:
            low=mid+1

        else:
            high=mid

        # print(low,high,mid)

        
    if letters[high]<=target:
        return letters[0]
    return letters[high]



    # for ch in letters:
    #     if ch>target:
    #         return ch

    # return letters[0]