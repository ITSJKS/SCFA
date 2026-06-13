def nextGreatestLetter(letters, target):

    # s = 0
    # e = len(letters) - 1

    # ans = letters[0]

    # while s <= e:

    #     mid = (s + e) // 2

    #     if letters[mid] > target:

    #         ans = letters[mid]
    #         e = mid - 1

    #     else:
    #         s = mid + 1

    # return ans

  
    l=(letters)
    s=0
    e=len(l)-1
    ans=l[0]
    
    while s<=e:
        mid=(s+e)//2
        if l[mid]>target:
            ans=l[mid]
            e=mid-1
        else:
            s=mid+1
    return ans