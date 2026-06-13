def isPresent(n, nums, target):
    #write your code here
    s=0
    e=n-1
    while s<=e:
        mid=(s+e)//2
        if nums[mid]==target:
            return mid
        elif target>nums[mid]:
            e=mid-1
        else:
            s=mid+1
    return -1