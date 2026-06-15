def isPresent(n, nums, target):
    #write your code here
    s=0
    e=len(nums)-1
    ans=-1
    while s<=e:
        mid=(s+e)//2
        if nums[mid]==target:
            ans = mid 
            return ans
        elif nums[mid]>target:
            s= mid + 1
        else:
            e = mid - 1
    return ans