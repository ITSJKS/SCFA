def nextGreatestLetter(letters, target):
    n=len(letters)
    left=0
    right=n-1
    ans=letters[0]
    while left<=right:
        mid=(left+right)//2
        if letters[mid]>target:
            ans = letters[mid]
            right=mid-1

        else:
            left=mid+1

    return ans